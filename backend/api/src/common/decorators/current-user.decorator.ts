import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { Role } from '@prisma/client';

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: Role;
}

// Inyecta el usuario autenticado (lo deja la JwtStrategy en req.user).
// Uso: getMe(@CurrentUser() user: AuthenticatedUser)
export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): AuthenticatedUser => {
    const req = ctx.switchToHttp().getRequest();
    return req.user as AuthenticatedUser;
  },
);
