import { Injectable } from '@nestjs/common';
import { shared } from '@tr/shared';

@Injectable()
export class AppService {
  getHello(): string {
    // console.log(next);
    return `Hello World!!!! ${shared()}`;
  }

  getBye(): string {
    return `Bye lelo ${shared()}`;
  }
}
