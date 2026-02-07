import { Injectable } from '@nestjs/common';
import { EmailInterface } from './interface';
import { NodemailerService } from './nodemailer.service';
import { NoneService } from './none.service';

@Injectable()
export class EmailService {
  emailservice: EmailInterface;

  constructor() {
    this.emailservice = this.getProvider();
    console.log(`Email provider is: ${this.emailservice.name}`);
  }

  getProvider() {
    if (!process.env.EMAIL_PROVIDER) {
      throw new Error('EMAIL_PROVIDER required in .env');
    }
    switch (process.env.EMAIL_PROVIDER) {
      case 'nodemailer':
        return new NodemailerService();
      case 'none':
        return new NoneService();
      default:
        return new NoneService();
    }
  }

  async sendMail(
    to: string,
    subject: string,
    html: string,
    emailFrom: { name: string; address: string },
  ) {
    // here you can validate email or modify html
    try {
      const sends = await this.emailservice.sendMail(
        to,
        subject,
        html,
        emailFrom,
      );
      console.log(sends);
    } catch (err) {
      console.log(err);
    }
  }
}
