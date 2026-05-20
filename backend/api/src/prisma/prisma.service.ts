import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

// Servicio compartido que envuelve el cliente Prisma.
// - Conecta al arrancar el módulo y se desconecta al cerrarlo.
// - Loguea queries lentas en dev para detectar cuellos de botella temprano.
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    super({
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'stdout', level: 'error' },
        { emit: 'stdout', level: 'warn' },
      ],
    });
  }

  async onModuleInit() {
    await this.$connect();
    if (process.env.NODE_ENV !== 'production') {
      // Cualquier query > 250ms va al log como warn.
      // @ts-expect-error Prisma tipa los eventos como union, esto es seguro en runtime.
      this.$on('query', (e: { duration: number; query: string }) => {
        if (e.duration > 250) {
          this.logger.warn(`slow query ${e.duration}ms: ${e.query.slice(0, 120)}…`);
        }
      });
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
