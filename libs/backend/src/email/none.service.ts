import { Injectable } from '@nestjs/common';
import { EmailInterface } from './interface';

@Injectable()
export class NoneService implements EmailInterface {
  name = 'none';
  async sendMail(
    to: string,
    subject: string,
    html: string,
    emailFrom: { name: string; address: string },
  ): Promise<void> {
    console.log(
      `An email is supposed to be sent from '${emailFrom.name} ${emailFrom.address}' to ${to} \n subject: ${subject}, ${html}`,
    );
  }
}
