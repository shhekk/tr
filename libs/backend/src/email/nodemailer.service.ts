import { Injectable } from '@nestjs/common';
import { EmailInterface } from './interface';

@Injectable()
export class NodemailerService implements EmailInterface {
  name = 'nodemailer';
  async sendMail(
    to: string,
    subject: string,
    html: string,
    emailFrom: { name: string; address: string },
  ): Promise<void> {
    console.log(`Yet InComplete`);
    return;
  }
}
