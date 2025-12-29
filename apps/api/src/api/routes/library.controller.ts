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

@Controller('Library')
export class LibraryController {
  constructor() {}

  @Get('/:id')
  async getLibraryDetails(@Param() id: string) {
    return { redirectURL: '' };
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
  async delete(@Body() updateBody: {}) {
    return { token: 'fa98sd7yfuasdlterimaakihcutt90a8f08ads9f' };
  }

  @Post('/adduser')
  async addReader() {}

  @Post('/remove-user')
  async removeReader() {}

  @Post('/user-role')
  async assignRole() {}
}
