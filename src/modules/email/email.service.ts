import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService) { }

    async sendTestEmail(email:string) {
        await this.mailerService.sendMail({
            to: email, // List of receivers
            from: 'noreply@example.com', // Sender address
            subject: 'Testing Nest MailerModule ✔', // Subject line
            template: './test', // The `.pug` or `.hbs` template to use
            context: {  // Data to be sent to template engine
              code: 'cf1a3f828287',
              username: 'john_doe',
            },
          });
}

async sendForgotPasswordEmail(email:string, url:string) {
    await this.mailerService.sendMail({
        to: email, // List of receivers
        from: 'noreply@example.com', // Sender address
        subject: 'Forgot Password', // Subject line
        template: './forgotPassword', // The `.pug` or `.hbs` template to use
        context: {  // Data to be sent to template engine
          email: email,
          resetLink: url,
        },
      });
}

async sendPasswordResetEmail(email:string) {
  await this.mailerService.sendMail({
      to: email, // List of receivers
      from: 'noreply@example.com', // Sender address
      subject: 'Forgot Password', // Subject line
      template: './passwordReset', // The `.pug` or `.hbs` template to use
      context: {  // Data to be sent to template engine
        email: email,
      },
    });
}
}
