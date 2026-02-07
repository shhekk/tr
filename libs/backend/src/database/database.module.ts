import { Module } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';
import { UserService } from './prisma/services/user.service';
import { BookService } from './prisma/services/book.service';

@Module({
  providers: [PrismaService, UserService, BookService], // all db entities services
  get exports() {
    return [...this.providers];
  },
})
export class DatabaseModule {}
