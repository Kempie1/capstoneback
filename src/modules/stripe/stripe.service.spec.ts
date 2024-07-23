import { Test, TestingModule } from '@nestjs/testing';
import { StripeService } from './stripe.service';
import { mockRepository } from 'test/testingUtils';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../users/entities/User.entity';
import { Order } from './entities/Order.entity';
import { OrderItem } from './entities/OrderItem.entity';
import { Product } from '../products/entities/Product.entity';
import { CartService } from '../cart/cart.service';
import { EmailService } from '../email/email.service';
import { ConfigService } from '@nestjs/config';

describe('StripeService', () => {
  let service: StripeService;
  let repositoryMock: typeof mockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StripeService,
        {
          provide: getRepositoryToken(User),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(Order),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(OrderItem),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: repositoryMock,
        },
        {
          provide: CartService,
          useValue: {
            getCart: jest.fn(),
          }
        },
        {
          provide: EmailService,
          useValue: {
            sendOrder: jest.fn(),
          }
        },
        {
          provide: 'STRIPE_API_KEY',
          useValue: "blablabalbalbla",
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              if (key === 'FRONTEND_URL') {
                return "test.com";
              }
              if (key === 'STRIPE_WEBHOOK_SECRET') {
                return "blablablabla";
              }
              return null;
            })
          },
        },
      ],
    }).compile();

    service = module.get<StripeService>(StripeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
