import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';

type userDto = { email: string; password: string };

@Controller('book')
export class BookController {
  constructor() {}

  @Get('/:id')
  async getBookDetails(@Param('id') id: string) {
    // const { id } = param;
    console.log(id);
    return { redirectURL: `https://localhost:4001/book/${id}` };
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
