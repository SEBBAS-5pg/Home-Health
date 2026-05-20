import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR, APP_PIPE } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { ValidationPipe } from '@nestjs/common';
import { LoggerModule } from 'nestjs-pino';

import { AuthModule } from './auth/auth.module';
import { CategoriesModule } from './categories/categories.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { TransformInterceptor } from './common/interceptors/transform.interceptor';
import { validateEnv } from './config/env.validation';
import { HealthModule } from './health/health.module';
import { InventoryModule } from './inventory/inventory.module';
import { NotificationsModule } from './notifications/notifications.module';
import { OrdersModule } from './orders/orders.module';
import { PrismaModule } from './prisma/prisma.module';
import { ProductsModule } from './products/products.module';
import { ReportsModule } from './reports/reports.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    // Validación de env al arranque.
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
    }),

    // Logs JSON estructurados con Pino. En dev usa pino-pretty para legibilidad.
    LoggerModule.forRoot({
      pinoHttp: {
        level: process.env.LOG_LEVEL ?? 'info',
        ...(process.env.NODE_ENV !== 'production' && {
          transport: { target: 'pino-pretty', options: { singleLine: true } },
        }),
        redact: ['req.headers.authorization', 'res.headers["set-cookie"]'],
      },
    }),

    // Rate limiting global.
    ThrottlerModule.forRootAsync({
      useFactory: () => [
        {
          ttl: Number(process.env.THROTTLE_TTL ?? 60) * 1000,
          limit: Number(process.env.THROTTLE_LIMIT ?? 100),
        },
      ],
    }),

    ScheduleModule.forRoot(),
    PrismaModule,

    // Módulos de dominio.
    AuthModule,
    UsersModule,
    CategoriesModule,
    ProductsModule,
    InventoryModule,
    OrdersModule,
    NotificationsModule,
    ReportsModule,
    HealthModule,
  ],
  providers: [
    // Validación de DTOs globalmente.
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: { enableImplicitConversion: true },
        }),
    },
    // Filter global para respuestas de error consistentes.
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    // Interceptor global para envolver respuestas en { data, meta }.
    { provide: APP_INTERCEPTOR, useClass: TransformInterceptor },
    // Rate limit y auth por defecto.
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: JwtAuthGuard },
  ],
})
export class AppModule {}
