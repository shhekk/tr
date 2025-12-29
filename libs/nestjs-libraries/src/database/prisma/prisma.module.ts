import { Controller, Get, Module } from '@nestjs/common';

@Controller('/prisma')
class PC {
  @Get('/random')
  async random() {
    return {
      name: 'abhishek kumar',
      firstname: 'abhishek',
      lastname: 'kumarrrr',
      age: 129,
      asd: 'asd',
    };
  }
}

@Module({
  controllers: [PC],
})
export class PrismaModule {}

export const adf = '--';
