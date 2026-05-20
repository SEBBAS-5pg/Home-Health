import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../common/decorators/public.decorator';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(private readonly prisma: PrismaService) {}

  // Liveness: la app está corriendo.
  @Public()
  @Get()
  alive() {
    return { status: 'ok', uptime: process.uptime() };
  }

  // Readiness: la app puede atender tráfico (BD responde).
  @Public()
  @Get('ready')
  async ready() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return { status: 'ready' };
    } catch {
      return { status: 'degraded', error: 'database unreachable' };
    }
  }
}
