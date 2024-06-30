import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/Product.entity';
import { GetByCategoryDTO } from './dtos/getCategory.dto';
import { GetByQueryDto } from './dtos/getByQuerry.dto';
import {
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { GetRelatedProductDTO } from './dtos/getRelatedProduct.dto';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getEmoji(): string {
    return this.productsService.getEmoji();
  }

  @Get('/search')
  async getProductBySearch(@Query() query: GetByQueryDto) {
    return this.productsService.get(query);
  }

  @Get('/category')
  async getProductByCategory(@Query() query: GetByCategoryDTO) {
    return this.productsService.get(query);
  }

  @Get('/related')
  getRelatedProduct(@Query() query: GetRelatedProductDTO){
    return this.productsService.getRelatedProduct(query);
  }

  @Get('/product/:id')
  getProduct(@Param('id', ParseUUIDPipe) id: string): Promise<Product | null> {
    return this.productsService.getProduct(id);
  }
}
