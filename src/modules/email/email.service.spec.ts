import { Test } from '@nestjs/testing';
import { EmailService } from './email.service';
import { MailerModule, MailerService } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import mailerConfig from '../../../config/email.config';

describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [EmailService, 
        {
        provide: ConfigService,
        useValue: {
          get: jest.fn((key: string) => {
            if (key === 'HOME_EMAIL') {
              return "noreply@example.com";
            }
            return null;
          })
        },
      },
        {
          provide: MailerService, useValue: {
            sendMail: jest.fn()
          }
        }
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
