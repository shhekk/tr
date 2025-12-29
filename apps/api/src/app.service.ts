import { Injectable } from '@nestjs/common';
import { add } from '@r4/shared';
import { next, adf as a } from '@r4/nestjs-libraries';

const adf = next + '____';

@Injectable()
export class AppService {
  getHello(): string {
    console.log(next);
    return `Hello World!!! ${add(68, 2)} value: ${adf} ${a}`;
  }

  getBye(): string {
    console.log(next);
    return `Bye lelo ${add(66, 3)}`;
  }
}

export const asdf = 'jljkl;jl;jkljljlj';
