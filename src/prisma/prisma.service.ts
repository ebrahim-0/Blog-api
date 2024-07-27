import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    await this.$connect()
      .then(() => {
        console.log('Database connected'.green.underline.bold + ' ✅');
      })
      .catch((e) => {
        console.log(
          'Error connecting to database'.red.underline.bold + ' ❌',
          e,
        );
      });
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
