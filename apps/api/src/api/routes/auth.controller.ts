import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  Query,
} from '@nestjs/common';

type userDto = { email: string; password: string };

@Controller('auth')
export class AuthController {
  // private prismaService: any;
  // private AuthHelper: any;
  constructor() {}

  @Post('signup')
  async signup(@Body() body: userDto) {
    /**
     * existing user ???????????????????????????????????????
     * create a new user
     * return redirectUrl with prop needed
     */

    return { body: body ?? 'not found' };
  }

  @Post('login')
  async login() {
    /**
     * fetch user
     * make access token
     * send token
     */
    return { token: 'fa98sd7yfuasdlterimaakihcutt90a8f08ads9f' };
  }

  @Get('verify')
  async verify(@Query() token: string) {
    /**
     * get token query
     * verify
     * send token
     * frontend save token in storage. → * any req. will be send using this token.
     */
    if (!token) throw new BadRequestException();

    return { redirectURL: '' };
  }
}
