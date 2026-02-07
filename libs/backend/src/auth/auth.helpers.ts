import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { UserService } from '@tr/db/user.service';
import { AuthService } from './auth.service';

export class AuthHelper {
  static sign<T extends {}>(data: T, Options: jwt.SignOptions = {}) {
    return jwt.sign(data, process.env.JWT_SECRET, Options);
  }

  static verify<T extends {}>(token: string) {
    return jwt.verify(token, process.env.JWT_SECRET!) as
      | (jwt.JwtPayload & T)
      | undefined;
  }

  static generateOtp() {
    // c.generateKey('hmac', { length: 500 }, () => {})
    return crypto.randomInt(1000, 9999);
  }

  static generateId(data: any = process.env.JWT_SECRET) {
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  static async hash(password: string): Promise<string> {
    return await bcrypt.hash(password, Number(process.env.SALT_ROUNDS));
  }

  static async compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }
}

export const Cookie = {
  SESSION: 'signup_session',
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  FORGOTTEN: 'forgotten', // all keys are stored lowercase in cookies/headers
} as const;

export type JWTAuthToken = { email: string };
