import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from './generated/client';
import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleDestroy, OnModuleInit
{
  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL as string,
    });
    super({ adapter });
  }

  async onModuleInit() {
    try {
      await this.$connect();
    } catch (error) {
      console.error('Error while connecting database');
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}

// @Injectable()
// export class PrismaRepository<T extends keyof PrismaService> {
//   model: PrismaService[T];
//   constructor(
//     private prisma: PrismaService,
//     model: T, // **not possible in nest js** **nest js use injectables**
//   ) {
//     this.model = this.prisma[model];
//   }
// }
