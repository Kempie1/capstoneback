import { Test, TestingModule } from '@nestjs/testing';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

describe('CartController', () => {
  let controller: CartController;
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CartController],
      providers: [{
        provide: CartService,
        useValue: {
          getCart: jest.fn(),
          addProductToCart: jest.fn(),
          removeProductFromCart : jest.fn(),
          editProductInCart: jest.fn(),
          compatibilityCheck: jest.fn(),
        },
      },]
    }).compile();

    controller = module.get<CartController>(CartController);
    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });
});
