import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { randomUUID } from 'crypto';
import { Request, Response } from 'express';

// Filtro global de excepciones.
// Convierte todo error en una respuesta estructurada:
//   { error: { code, message, traceId, path } }
// Mapea errores conocidos de Prisma a códigos HTTP útiles.
@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();
    const traceId = (req.headers['x-trace-id'] as string) ?? randomUUID();

    const { status, code, message } = this.mapException(exception);

    this.logger.error(
      `[${traceId}] ${req.method} ${req.url} → ${status} ${code}: ${message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    res.status(status).json({
      error: { code, message, traceId, path: req.url },
    });
  }

  private mapException(exception: unknown): { status: number; code: string; message: string } {
    if (exception instanceof HttpException) {
      const r = exception.getResponse();
      const message =
        typeof r === 'string' ? r : ((r as { message?: string | string[] }).message ?? exception.message);
      return {
        status: exception.getStatus(),
        code: this.codeFromStatus(exception.getStatus()),
        message: Array.isArray(message) ? message.join('; ') : message,
      };
    }

    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      switch (exception.code) {
        case 'P2002':
          return {
            status: HttpStatus.CONFLICT,
            code: 'UNIQUE_CONSTRAINT',
            message: 'Ya existe un registro con esos datos únicos',
          };
        case 'P2025':
          return {
            status: HttpStatus.NOT_FOUND,
            code: 'NOT_FOUND',
            message: 'Recurso no encontrado',
          };
        case 'P2003':
          return {
            status: HttpStatus.CONFLICT,
            code: 'FOREIGN_KEY_VIOLATION',
            message: 'Referencia inválida a otra entidad',
          };
      }
    }

    return {
      status: HttpStatus.INTERNAL_SERVER_ERROR,
      code: 'INTERNAL_ERROR',
      message: 'Error inesperado',
    };
  }

  private codeFromStatus(status: number): string {
    return (
      {
        400: 'BAD_REQUEST',
        401: 'UNAUTHORIZED',
        403: 'FORBIDDEN',
        404: 'NOT_FOUND',
        409: 'CONFLICT',
        422: 'UNPROCESSABLE',
        429: 'TOO_MANY_REQUESTS',
      }[status] ?? 'ERROR'
    );
  }
}
