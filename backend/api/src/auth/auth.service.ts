import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { createHash, randomBytes } from 'crypto';
import {
  InvalidCredentialsException,
  InvalidOrExpiredTokenException,
} from '../common/exceptions/domain.exceptions';
import { PrismaService } from '../prisma/prisma.service';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

export interface TokenPair {
  accessToken: string;
  refreshToken: string;
}

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) {
      // No revelamos si el correo existe (anti-enumeration) — devolvemos error genérico.
      throw new InvalidCredentialsException();
    }

    const rounds = this.config.get<number>('BCRYPT_ROUNDS', 12);
    const passwordHash = await bcrypt.hash(dto.password, rounds);

    const user = await this.prisma.user.create({
      data: {
        fullName: dto.fullName,
        email: dto.email,
        phone: dto.phone,
        passwordHash,
        role: Role.CLIENT,
      },
      select: { id: true, email: true, fullName: true, role: true },
    });

    return user;
  }

  async login(dto: LoginDto): Promise<TokenPair & { user: { id: string; email: string; role: Role } }> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email },
      select: { id: true, email: true, role: true, passwordHash: true, isActive: true },
    });
    if (!user || !user.isActive) throw new InvalidCredentialsException();

    const ok = await bcrypt.compare(dto.password, user.passwordHash);
    if (!ok) throw new InvalidCredentialsException();

    const tokens = this.signTokens(user.id, user.email, user.role);
    return {
      ...tokens,
      user: { id: user.id, email: user.email, role: user.role },
    };
  }

  async refresh(refreshToken: string): Promise<TokenPair> {
    try {
      const payload = this.jwt.verify<{ sub: string; email: string; role: Role }>(refreshToken, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
        select: { id: true, email: true, role: true, isActive: true },
      });
      if (!user || !user.isActive) throw new InvalidCredentialsException();
      return this.signTokens(user.id, user.email, user.role);
    } catch {
      throw new InvalidCredentialsException();
    }
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<void> {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    // Respondemos OK siempre, incluso si el correo no existe (anti-enumeration).
    if (!user) {
      this.logger.log(`forgot-password para correo no registrado: ${dto.email}`);
      return;
    }

    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = this.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // 30 min

    await this.prisma.passwordResetToken.create({
      data: { userId: user.id, tokenHash, expiresAt },
    });

    // TODO: enviar correo via SES con el link https://app/reset-password?token=rawToken.
    // Por ahora lo logueamos para que el equipo lo recoja del log.
    this.logger.log(`reset link para ${user.email}: token=${rawToken}`);
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const tokenHash = this.hashToken(dto.token);
    const record = await this.prisma.passwordResetToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!record || record.usedAt || record.expiresAt < new Date()) {
      throw new InvalidOrExpiredTokenException();
    }

    const rounds = this.config.get<number>('BCRYPT_ROUNDS', 12);
    const newHash = await bcrypt.hash(dto.newPassword, rounds);

    await this.prisma.$transaction([
      this.prisma.user.update({
        where: { id: record.userId },
        data: { passwordHash: newHash },
      }),
      this.prisma.passwordResetToken.update({
        where: { id: record.id },
        data: { usedAt: new Date() },
      }),
    ]);
  }

  private signTokens(userId: string, email: string, role: Role): TokenPair {
    const payload = { sub: userId, email, role };
    // `expiresIn` en @nestjs/jwt@11 está tipado como `StringValue | number`
    // (de la librería `ms`). El config devuelve string plano, así que casteamos.
    const accessExp = this.config.get<string>('JWT_ACCESS_EXPIRES_IN', '15m');
    const refreshExp = this.config.get<string>('JWT_REFRESH_EXPIRES_IN', '7d');
    return {
      accessToken: this.jwt.sign(payload, {
        secret: this.config.getOrThrow<string>('JWT_ACCESS_SECRET'),
        expiresIn: accessExp as unknown as number,
      }),
      refreshToken: this.jwt.sign(payload, {
        secret: this.config.getOrThrow<string>('JWT_REFRESH_SECRET'),
        expiresIn: refreshExp as unknown as number,
      }),
    };
  }

  // SHA-256 del token plano → lo que guardamos en la BD.
  // Si la BD se filtra, el atacante no puede usar el token directamente.
  private hashToken(raw: string): string {
    return createHash('sha256').update(raw).digest('hex');
  }
}
