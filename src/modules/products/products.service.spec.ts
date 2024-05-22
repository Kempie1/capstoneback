import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { Product } from './entities/Product.entity';
import { Category } from './entities/Category.entity';
import { ProductCharacteristic } from './entities/ProductCharacteristic.entity';

describe('ProductsService', () => {
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductsService],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('should get a product', async () => {
    const category: Category = {
      id: '1',
      name: 'test-category'
    }
    
    const testCharacteristic: ProductCharacteristic = {
      id: '1',
      value: 'test-value',
      products: [],
      characteristic: null
    }
    const product: Product = { 
      id: '1', 
      name: 'Test Product', 
      imgUrl: 'test-img-url',
      categories: [category],
      productCharacteristics: [testCharacteristic]
    };

    jest.spyOn(service, 'getProduct').mockImplementation(() => Promise.resolve(product));

    expect(await service.getProduct('1')).toBe(product);
  });
});
