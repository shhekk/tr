import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { UserService } from '@tr/db/user.service';

type userDto = { email: string; password: string };

@Controller('user')
export class UserController {
  constructor(private userService: UserService) {}

  @Get('/')
  async getAllUsers(res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      return users.map((u) => {
        const { password, ...user } = u;
        return user;
      });
    } catch (e) {
      // console.error(e);
      throw e;
    }
  }

  @Get('/:id')
  async getUserDetails(@Param() id: string) {
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
  async removeUser() {}
}
