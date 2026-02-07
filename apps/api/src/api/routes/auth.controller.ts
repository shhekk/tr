import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Inject,
  NotFoundException,
  Post,
  Req,
  Res,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@tr/db/user.service';
import { AuthService } from '@tr/backend/auth/auth.service';
import {
  ForgottenPasswordDTO,
  LoginUserDTO,
  RegisterDTO,
  ResetPasswordDTO,
  SignupSessionDTO,
  VerifyOtpDTO,
} from '@tr/backend/dtos/auth.dto';
import { InvalidCredentials } from '@tr/backend/exceptions/InvalidCredentials';
import { Request, Response } from 'express';
import {
  AuthHelper,
  Cookie,
  JWTAuthToken,
} from '@tr/backend/auth/auth.helpers';
import * as AUTHPOLICY from '@tr/constant/Policy/auth';
import { GetUser } from '@tr/backend/helpers/decorators';
import { User } from '@tr/backend/database';
import { MICROSERVICES } from '@tr/backend/constants/microservice';
import { ClientProxy } from '@nestjs/microservices';

@Controller('auth')
export class AuthController {
  constructor(
    private auth: AuthService,
    private user: UserService,
    @Inject(MICROSERVICES.NOTIFICATION) private notifyClient: ClientProxy,
    // private notification: NotificationService
  ) {}

  @Post('signup-session')
  async signup(@Body() { email }: SignupSessionDTO) {
    await this.auth.canRegister(email);

    const { otp } = await this.auth.generateOtp(email);

    // this.mail.sendEmail(email, `Your OTP: ${otp}`)
    // console.log(`Your OTP: ${otp}`);
    this.notifyClient.emit('send_email', {
      to: 'to@mailhost.in',
      subject: 'checking email',
      html: `<h1>Your OTP is: ${otp}</h1>`,
      emailFrom: {
        address: 'tr.app',
        name: 'tr-admin',
      },
    });

    return {
      message: 'otp sent on email, please verify opt.',
    };
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body()
    { email, otp }: VerifyOtpDTO,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { isCorrect, attempts } = await this.auth.verifyOTP(email, otp);

    console.log('otp', otp, isCorrect);
    if (!isCorrect) {
      throw new InvalidCredentials({
        message: 'Incorrect OTP',
        attemptsLeft: attempts,
      });
    }

    const { session, maxAge } = await this.auth.createSession(email);

    this.auth.setSecureCookie(res, Cookie.SESSION, session, maxAge);

    return {
      message: 'OTP Verified',
      ...(process.env.NODE_ENV === 'development'
        ? {
            signup_session: session,
            message:
              'Otp Verified, set signup session in header[signup_session]',
          }
        : {}),
    };
  }

  @Post('register')
  async register(
    @Body() body: RegisterDTO,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    const token = req.cookies?.[Cookie.SESSION] ?? req.headers[Cookie.SESSION];
    if (!token) {
      throw new UnauthorizedException({
        error: 'Invalid Signup Session',
      });
    }

    if (!(await this.auth.isValidSession(body.email))) {
      throw new InvalidCredentials();
    }

    await this.auth.canRegister(body.email, body.username);

    const _ = await this.auth.deleteSession(body.email);

    const accessToken = AuthHelper.sign<JWTAuthToken>(
      { email: body.email },
      { expiresIn: AUTHPOLICY.ACCESS_TOKEN_EXP },
    );

    const refreshToken = AuthHelper.sign<JWTAuthToken>(
      { email: body.email },
      { expiresIn: AUTHPOLICY.REFRESH_TOKEN_EXP },
    );

    const user = await this.user.createUser({
      ...body,
      refresh: refreshToken,
    });

    this.auth.setSecureCookie(res, Cookie.SESSION, null, 0);

    this.auth.setSecureCookie(
      res,
      Cookie.ACCESS_TOKEN,
      accessToken,
      AUTHPOLICY.ACCESS_TOKEN_EXP,
    );

    this.auth.setSecureCookie(
      res,
      Cookie.REFRESH_TOKEN,
      refreshToken,
      AUTHPOLICY.REFRESH_TOKEN_EXP,
    );

    res.end();
  }

  @Get('refresh-token')
  async refreshToken(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { decoded, token } = this.auth.decodeReqToken<JWTAuthToken>(
      req,
      Cookie.REFRESH_TOKEN,
    );

    const { email } = decoded;

    const { refresh } = await this.user.getUserByEmail(email);
    if (refresh !== token) {
      // on logout, refresh token is being revoked from user table.
      // So, do check if the token is valid or not.
      throw new UnauthorizedException();
    }

    const user = await this.user.updateRefreshToken({
      email,
      providerName: 'LOCAL',
      refresh: token,
    });

    if (!user) throw new UnauthorizedException();

    const accessToken = AuthHelper.sign<JWTAuthToken>(
      { email: user.email },
      { expiresIn: AUTHPOLICY.ACCESS_TOKEN_EXP },
    );

    this.auth.setSecureCookie(
      res,
      Cookie.ACCESS_TOKEN,
      accessToken,
      AUTHPOLICY.ACCESS_TOKEN_EXP,
    );

    res.end();
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body() body: LoginUserDTO,
  ) {
    const { email, username, password } = body;

    if (!email && !username)
      throw new BadRequestException('Either email or username is required');

    const user = await this.user.getUserByEmailorUsername(
      'LOCAL',
      email,
      username,
    );

    const isCorrect = await AuthHelper.compare(password, user.password);

    if (!user || !isCorrect) {
      throw new InvalidCredentials();
    }

    if (!user) throw new NotFoundException('User Not Found');

    const accessToken = AuthHelper.sign<JWTAuthToken>(
      { email: user.email },
      { expiresIn: AUTHPOLICY.ACCESS_TOKEN_EXP },
    );

    this.auth.setSecureCookie(
      res,
      Cookie.ACCESS_TOKEN,
      accessToken,
      AUTHPOLICY.ACCESS_TOKEN_EXP,
    );

    if (process.env.NODE_ENV === 'development') {
      res.json({ accessToken });
    }

    res.end();
  }

  @Post('forgotten-password')
  async ForgotPassword(
    @Res({ passthrough: true }) res: Response,
    @Body() { email }: ForgottenPasswordDTO,
  ) {
    await this.auth.checkSpammer(email);

    const user = await this.user.getUserByEmail(email);

    if (!user) throw new NotFoundException('Email does not exists.');

    const shortlivedtoken = AuthHelper.sign<JWTAuthToken>(
      { email },
      { expiresIn: AUTHPOLICY.FORGOTTEN_EXP },
    );

    const { otp } = await this.auth.generateOtp(email);

    // await this.notification.sendEmail(otp)
    console.log('Your reset password otp: ', otp);

    this.auth.setSecureCookie(
      res,
      Cookie.FORGOTTEN,
      shortlivedtoken,
      AUTHPOLICY.FORGOTTEN_EXP,
    );

    return {
      message: 'OTP sent on email, Verify email',
      before: Date.now() + AUTHPOLICY.FORGOTTEN_EXP,
      ...(process.env.NODE_ENV === 'development' && {
        [Cookie.FORGOTTEN]: shortlivedtoken,
      }),
    };
  }

  @Post('reset-password')
  async resetPassword(@Req() req: Request, @Body() body: ResetPasswordDTO) {
    const { decoded } = this.auth.decodeReqToken<JWTAuthToken>(
      req,
      Cookie.FORGOTTEN,
    );

    const { email } = decoded;
    const { otp, password } = body;

    const { isCorrect, attempts } = await this.auth.verifyOTP(email, otp);

    if (!isCorrect) {
      throw new InvalidCredentials({
        message: 'Incorrect OTP',
        attemptsLeft: attempts,
      });
    }

    const { id } = await this.user.getUserByEmail(email);

    await this.user.updateUserDetails(id, { password });

    // this.notification.sendEmail('your password changed')
    console.log('Your password changed for: ', email);

    return {
      message: 'Password Changed',
    };
  }

  @Get('logout')
  async logout(
    @Res({ passthrough: true }) res: Response,
    @GetUser() user: User,
  ) {
    const { email } = user;
    //revoke refresh token
    await this.user.updateRefreshToken({
      email,
      providerName: 'LOCAL',
      refresh: null,
    });

    this.auth.setSecureCookie(res, Cookie.ACCESS_TOKEN, null, 0);
    this.auth.setSecureCookie(res, Cookie.REFRESH_TOKEN, null, 0);
    res.json({
      message: 'User Logged out.',
    });
  }
}
