import { config as dotenvConfig } from 'dotenv';
import { MailerOptions } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

dotenvConfig({ path: '.env' });
const mailerConfig:MailerOptions = {
    // Ethereal email service captures outbound emails for testing
    transport: {
      service: "smtp2go",
      host: 'mail.smtp2go.com',
      port: 2525,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      }
    },
    defaults: {
      from: '"Artemsoft" <'+ process.env.HOME_EMAIL+">",
    },
    template: {
      dir: 'dist/src/templates',
      adapter: new PugAdapter(),
      options: {
        strict: true,
      },
    },
  }

export default mailerConfig
