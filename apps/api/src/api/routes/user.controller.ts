import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Inject,
  InternalServerErrorException,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { MICROSERVICES } from '@tr/backend/constants/microservice';
import { UserService } from '@tr/db/user.service';

type userDto = { email: string; password: string };
interface sendmail {
  to: string;
  subject: string;
  html: string;
  emailFrom: {
    name: string;
    address: string;
  };
}

@Controller('user')
export class UserController {
  constructor(
    private userService: UserService,
    @Inject(MICROSERVICES.NOTIFICATION) private notify: ClientProxy,
  ) {}

  @Get('/')
  async getAllUsers(res: Response) {
    try {
      const users = await this.userService.getAllUsers();
      return users.map((u) => {
        const { password, ...user } = u;
        return user;
      });
    } catch (e) {
      console.error(e);
      return false;
    }
  }

  @Get('mail')
  async sendmail() {
    await this.notify.emit('send_email', {
      to: 'to@mailhost.in',
      subject: 'checking email',
      html: '<h1>Hello check mail</h1>',
      emailFrom: {
        address: 'tr.app',
        name: 'tr-admin',
      },
    } as sendmail);
  }

  @Get('/isavailable/:username')
  async checkUsernameAvailability(@Param('username') username: string) {
    return !(await this.userService.isUsernameTaken(username));
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
