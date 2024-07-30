import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { ConfigService } from '@nestjs/config';
import { OrderItem } from '../stripe/entities/OrderItem.entity';

@Injectable()
export class EmailService {
  constructor(
    private readonly mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendTestEmail(email: string) {
    await this.mailerService.sendMail({
      to: email, // List of receivers
      from: this.configService.get<string>('HOME_EMAIL'), // Sender address
      subject: 'Testing Nest MailerModule ✔', // Subject line
      template: './test', // The `.pug` or `.hbs` template to use
      context: {
        // Data to be sent to template engine
        code: 'cf1a3f828287',
        username: 'john_doe',
      },
    });
  }

  async sendForgotPasswordEmail(email: string, url: string) {
    await this.mailerService.sendMail({
      to: email, // List of receivers
      from: this.configService.get<string>('HOME_EMAIL'), // Sender address
      subject: 'Forgot Password', // Subject line
      template: './forgotPassword', // The `.pug` or `.hbs` template to use
      context: {
        // Data to be sent to template engine
        email: email,
        resetLink: url,
      },
    });
  }

  async sendPasswordResetEmail(email: string) {
    await this.mailerService.sendMail({
      to: email, // List of receivers
      from: this.configService.get<string>('HOME_EMAIL'), // Sender address
      subject: 'Forgot Password', // Subject line
      template: './passwordReset', // The `.pug` or `.hbs` template to use
      context: {
        // Data to be sent to template engine
        email: email,
      },
    });
  }

  async sendOrder(email: string, orderItems: OrderItem[], orderTotal: string) {
    await this.mailerService.sendMail({
      to: email, // List of receivers
      from: this.configService.get<string>('HOME_EMAIL'), // Sender address
      subject: 'Order Confirmation', // Subject line
      template: './order', // The `.pug` or `.hbs` template to use
      context: {
        // Data to be sent to template engine
        email: email,
        orderItems: orderItems,
        orderTotal: orderTotal, //Convert cents to dollars
      },
    });
  }
}
