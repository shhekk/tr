import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  UnauthorizedException,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { Request, Response } from 'express';
import { AuthHelper } from '@tr/backend/auth/auth.helpers';
import { UserService } from '@tr/db/user.service';
import { ACCESS_TOKEN_EXP } from '@tr/constant/Policy/auth';

const AUTHKEYS = {
  SIGNUP_SESSION: 'signup_session',
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
} as const;

/**
 * @deprecated
 */
@Injectable()
export class RefreshTokenInterceptor implements NestInterceptor {
  constructor(private readonly userService: UserService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const refreshToken = req.cookies?.[AUTHKEYS.REFRESH_TOKEN];
    if (!refreshToken) throw new UnauthorizedException();

    const decoded = AuthHelper.verify(refreshToken);
    if (!decoded) throw new UnauthorizedException();

    const user = await this.userService.getUserByEmail(decoded.email);
    if (!user || user.refresh !== refreshToken) {
      throw new UnauthorizedException();
    }

    // expose validated data to handler
    (req as any).auth = {
      email: decoded.email,
      refreshToken,
    };

    return next.handle().pipe(
      tap(() => {
        const accessToken = AuthHelper.sign(
          { id: user.id },
          { expiresIn: ACCESS_TOKEN_EXP },
        );

        res.cookie(AUTHKEYS.ACCESS_TOKEN, accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'none',
          expires: new Date(Date.now() + ACCESS_TOKEN_EXP),
        });
      }),
    );
  }
}
