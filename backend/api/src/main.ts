import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bufferLogs: true });
  const logger = app.get(Logger);
  app.useLogger(logger);

  // Seguridad y CORS.
  app.use(helmet());
  app.enableCors({
    origin: (process.env.CORS_ORIGIN ?? 'http://localhost:3000').split(','),
    credentials: true,
  });

  // Prefijo común. El frontend ya apunta a NEXT_PUBLIC_API_URL/api.
  app.setGlobalPrefix('api', { exclude: ['health', 'health/ready'] });

  // Apagado limpio: termina conexiones de Prisma y otros recursos.
  app.enableShutdownHooks();

  // Swagger en dev.
  if (process.env.NODE_ENV !== 'production') {
    const swagger = new DocumentBuilder()
      .setTitle('Home-Health API')
      .setDescription('Gestión de farmacia: catálogo, inventario, pedidos, vencimientos y reportes.')
      .setVersion('0.1.0')
      .addBearerAuth()
      .build();
    const doc = SwaggerModule.createDocument(app, swagger);
    SwaggerModule.setup('docs', app, doc);
  }

  const port = Number(process.env.PORT ?? 4000);
  await app.listen(port);
  logger.log(`Home-Health API escuchando en http://localhost:${port}`);
}

bootstrap();
