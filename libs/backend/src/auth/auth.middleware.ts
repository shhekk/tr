import {
  CanActivate,
  ExecutionContext,
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@tr/db/user.service';
import { Cookie, JWTAuthToken } from './auth.helpers';
import { AuthService } from './auth.service';
import { Request } from 'express';
import { Observable } from 'rxjs';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private user: UserService,
    private auth: AuthService,
  ) {}
  async use(req: Request, res: any, next: (error?: any) => void) {
    try {
      const { decoded } = this.auth.decodeReqToken<JWTAuthToken>(
        req,
        Cookie.ACCESS_TOKEN,
      );

      const user = await this.user.getUserByEmail(decoded.email);
      if (!user) throw new Error();

      const { password, ...data } = user;

      //@ts-ignore
      req.user = data;

      console.log(
        `${user.email} requested on ${req.path} at ${Date.now().toLocaleString}`,
      );
      next();
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException();
    }
  }
}
