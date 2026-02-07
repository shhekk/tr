import { HttpException, HttpStatus } from '@nestjs/common';

export class TooManyRequestException extends HttpException {
  constructor(error: string | Object = 'Too Many Request') {
    super(
      {
        ...(typeof error === 'object' ? error : { error }),

        status: HttpStatus.TOO_MANY_REQUESTS,
      },
      HttpStatus.TOO_MANY_REQUESTS,
      {
        cause: error,
      },
    );
  }
}
