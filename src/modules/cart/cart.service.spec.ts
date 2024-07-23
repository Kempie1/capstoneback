import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ShoppingCart } from './entities/ShoppingCart.entity';
import { Repository } from 'typeorm';
import { CartItem } from './entities/CartItem.entity';
import { Product } from '../products/entities/Product.entity';
import { ProductsService } from '../products/products.service';
import { mockRepository } from 'test/testingUtils';


describe('CartService', () => {
  let service: CartService;
  let repositoryMock: typeof mockRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartService, {
        provide: getRepositoryToken(ShoppingCart),
        useValue: repositoryMock,
      },
        {
          provide: getRepositoryToken(CartItem),
          useValue: repositoryMock,
        },
        {
          provide: getRepositoryToken(Product),
          useValue: repositoryMock,
        },
        {
          provide: ProductsService,
          useValue: {
            flattenProduct: jest.fn(),
          }

        }],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
