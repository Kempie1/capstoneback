import { config as dotenvConfig } from 'dotenv';
import { MailerOptions } from '@nestjs-modules/mailer';
import { PugAdapter } from '@nestjs-modules/mailer/dist/adapters/pug.adapter';

dotenvConfig({ path: '.env' });

const mailerConfig:MailerOptions = {
    // Ethereal email service captures outbound emails for testing
    transport: {
      host: 'smtp.ethereal.email',
      port: 587,
      auth: {
        user: 'guy31@ethereal.email',
        pass: 'khMa8JjSnsMEXRgBTQ'
      }
    },
    defaults: {
      from: '"nest-modules" <modules@nestjs.com>',
    },
    template: {
      dir: 'src/templates',
      adapter: new PugAdapter(),
      options: {
        strict: true,
      },
    },
  }

export default mailerConfig
