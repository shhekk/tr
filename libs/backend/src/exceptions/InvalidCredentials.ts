import { HttpException, HttpStatus } from '@nestjs/common';

export class InvalidCredentials extends HttpException {
  constructor(error: string | Object = 'Invalid Credentials') {
    super(
      {
        ...(typeof error === 'object' ? error : { error }),

        status: HttpStatus.FORBIDDEN,
      },
      HttpStatus.FORBIDDEN,
      {
        cause: error,
      },
    );
  }
}
