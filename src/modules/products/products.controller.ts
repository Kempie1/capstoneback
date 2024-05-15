import { Controller, Get, Param, ParseUUIDPipe, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/Product.entity';
import { GetByCategoryDTO } from './dtos/getCategory.dto';
import {
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  getHello(): string {
    return this.productsService.getHello();
  }

  @Get('/:id')
  getProduct(@Param('id', ParseUUIDPipe) id: string): Promise<Product | null> {
    return this.productsService.getProduct(id);
  }
  @Get('/category/:sortBy/:pageNumber')
  @ApiResponse({
    status: 200,
    description: 'The found record',
  })
  async getProductByCategory(@Query() query: GetByCategoryDTO) {
    return this.productsService.get(query);
    // return this.productsService.getProduct(id);
  }
}
