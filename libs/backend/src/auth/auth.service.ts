import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthHelper } from '@tr/backend/auth/auth.helpers';
import { RedisService } from '../redis/redis.service';
import { UserService } from '../database/prisma/services/user.service';
import { TooManyRequestException } from '../exceptions/TooManyRequest.exception';
import { Request, Response } from 'express';
import * as AUTHPOLICY from '@tr/constant/Policy/auth';

const REDIS_KEYS = ['signup_session', 'otp', 'otp_attempts', 'spam'] as const;

@Injectable()
export class AuthService {
  private readonly OTP_TTL = AUTHPOLICY.OTP_TTL / 1000;
  private readonly SESSION_TTL = AUTHPOLICY.SESSION_TTL / 1000;
  private readonly SPAM_TTL = AUTHPOLICY.SPAM_TTL / 1000;
  private readonly MAX_OTP_RETRIES = AUTHPOLICY.MAX_OTP_RETRIES;

  constructor(
    private readonly redis: RedisService,
    private readonly userService: UserService,
  ) {}

  decodeReqToken<T extends {}>(req: Request, key: string) {
    const token = (req.cookies?.[key] ?? req.headers[key]) as string;
    if (!token) throw new UnauthorizedException();

    const decoded = AuthHelper.verify<T>(token);
    if (!decoded) throw new UnauthorizedException();

    return { ...{ decoded }, token };
  }

  /**
   * @param key
   * @param data
   * @param maxAge Lifetime of the cookie (7 * 24 * 60 * 60 * 1000) -> 7days
   */
  setSecureCookie(res: Response, key: string, data: any, maxAge: number) {
    res.cookie(key, data, {
      httpOnly: true,
      secure: true,
      sameSite: 'none',
      maxAge, // Lifetime of the cookie
      // expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Exact date of expiry
      // If both Expires and Max-Age are set, Max-Age takes precedence.
    });
  }

  async canRegister(email: string, username?: string) {
    await this.checkSpammer(email);

    if (await this.userService.isEmailTaken(email)) {
      throw new ConflictException({ error: 'Email already exists' });
    }

    if (username && (await this.userService.isUsernameTaken(username))) {
      throw new ConflictException({ error: 'Username taken' });
    }
  }

  async generateOtp(email: string) {
    const otp = AuthHelper.generateOtp();

    await Promise.all([
      this.redis.set(this.key('otp', email), otp, this.OTP_TTL),
      this.redis.set(
        this.key('otp_attempts', email),
        this.MAX_OTP_RETRIES,
        this.OTP_TTL,
      ),
    ]);

    return { otp };
  }

  async verifyOTP(email: string, otp: number) {
    await this.checkSpammer(email);

    let isCorrect = false;

    const attempts = await this.get<number>('otp_attempts', email);

    if (attempts < 0) {
      const { till } = await this.markSpammer(email);
      throw new TooManyRequestException({
        error: 'Email locked for a while',
        retryAfter: till,
      });
    }

    const storedOtp = await this.get<number>('otp', email);

    isCorrect = storedOtp === otp;

    if (!isCorrect) {
      await this.redis.set(
        this.key('otp_attempts', email),
        attempts - 1,
        await this.redis.ttl(this.key('otp_attempts', email)),
      );
    } else {
      await this.redis.dlt(
        this.key('otp', email),
        this.key('otp_attempts', email),
      );
    }

    return { isCorrect, attempts };
  }

  async createSession(email: string) {
    const session = AuthHelper.sign({ email });

    await this.redis.set(
      this.key('signup_session', email),
      session,
      this.SESSION_TTL,
    );

    return {
      session,
      maxAge: this.SESSION_TTL * 1000,
    };
  }

  async isValidSession(email: string): Promise<boolean> {
    const session = await this.redis.get<string>(
      this.key('signup_session', email),
    );
    if (!session) throw new UnauthorizedException('Session expired');

    const decoded = AuthHelper.verify(session);
    console.log(
      decoded,
      decoded?.email,
      email,
      !decoded || decoded.email !== email,
    );

    return decoded ? decoded.email === email : false;
  }

  async deleteSession(email: string) {
    // await this.redis.dlt(this.key('otp', email));
    // await this.redis.dlt(this.key('otp_attempts', email));
    await this.redis.dlt(this.key('signup_session', email));

    return true;
  }

  async checkSpammer(email: string) {
    const key = this.key('spam', email);

    const isSpammer = !!(await this.redis.get(key));

    if (isSpammer) {
      throw new TooManyRequestException({
        error: 'Email locked for a while',
        retryAfter: Date.now() + (await this.redis.ttl(key)) * 1000,
      });
    }

    return false;
  }

  private async markSpammer(email: string) {
    await this.redis.dlt(
      this.key('otp', email),
      this.key('otp_attempts', email),
    );

    const ok = await this.redis.set(
      this.key('spam', email),
      true,
      this.SPAM_TTL,
    );

    if (!ok) throw new InternalServerErrorException('Redis error');

    return { till: Date.now() + this.SPAM_TTL * 1000 };
  }

  private async get<T>(key: (typeof REDIS_KEYS)[number], email: string) {
    const value = await this.redis.get<T>(this.key(key, email));
    if (value == null) throw new InternalServerErrorException();
    return value;
  }

  private key(key: (typeof REDIS_KEYS)[number], email: string) {
    return `${key}:${email}`;
  }
}
