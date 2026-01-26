import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class BookService {
  constructor(private Books: PrismaService) {}

  async getAll() {
    return await this.Books.book.findMany();
  }
}
