import { Body, Controller, Inject } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { EmailService } from '@tr/backend/email/email.service';

interface sendmail {
  to: string;
  subject: string;
  html: string;
  emailFrom: {
    name: string;
    address: string;
  };
}

@Controller()
export class EmailController {
  constructor(private readonly Emailservice: EmailService) {}

  @MessagePattern('send_email')
  async sendMail(@Body() data: sendmail) {
    const { emailFrom, html, to, subject } = data;
    // console.log('calling email service');
    await this.Emailservice.sendMail(to, subject, html, emailFrom);

    return;
  }
}
