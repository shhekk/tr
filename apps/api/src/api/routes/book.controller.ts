import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
} from '@nestjs/common';
import { GetUser } from '@tr/backend/helpers/decorators/getUser';

type userDto = { email: string; password: string };

@Controller('book')
export class BookController {
  constructor() {}

  @Get('/:id')
  async getBookDetails(@Param('id') bookId: string, @GetUser() user: any) {
    // const { id } = param;
    // console.log({ user });
    return { bookId };
  }

  @Post()
  async create(@Body() body: userDto) {
    return { body: body ?? 'not found' };
  }

  @Post('update')
  async update(@Body() updateBody: {}) {
    return { token: 'fa98sd7yfuasdlterimaakihcutt90a8f08ads9f' };
  }

  @Delete('update')
  async login(@Body() updateBody: {}) {
    return { token: 'fa98sd7yfuasdlterimaakihcutt90a8f08ads9f' };
  }

  @Post('/adduser')
  async addReader() {
    return { message: 'true' };
  }
}
