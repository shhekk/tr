import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '@tr/db/user.service';
import { AuthService } from './auth.service';
import { Cookie, JWTAuthToken } from './auth.helpers';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private user: UserService,
    private auth: AuthService,
  ) {}
  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    try {
      const req = ctx.switchToHttp().getRequest();
      const { decoded } = this.auth.decodeReqToken<JWTAuthToken>(
        req,
        Cookie.ACCESS_TOKEN,
      );

      const user = await this.user.getUserByEmail(decoded.email);
      if (!user) throw new Error();

      const { password, ...data } = user;

      //@ts-ignore
      req.user = data;
      return true;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
