import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { mockRepository } from 'test/testingUtils';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/User.entity';
import { PasswordReset } from './entities/PasswordReset.entity';
import { ShoppingCart } from '../cart/entities/ShoppingCart.entity';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

describe('AuthService', () => {
  let service: AuthService;
  let repositoryMock: typeof mockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(PasswordReset),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(ShoppingCart),
          useValue: repositoryMock,
        },
        {
          provide: EmailService,
          useValue: {
            sendForgotPasswordEmail: jest.fn(),
            sendPasswordResetEmail: jest.fn(),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'FRONTEND_URL') {
                return 'test.com';
              }
              return null;
            }),
          },
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
