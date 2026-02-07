type EmailFrom = { name: string; address: string };

export interface EmailInterface {
  name: string;
  sendMail(
    to: string,
    subject: string,
    html: string,
    emailFrom: EmailFrom,
  ): Promise<void>;
}
