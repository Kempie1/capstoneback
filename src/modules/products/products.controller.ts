import { Controller, Get, Param, ParseUUIDPipe, Query, Body, Post } from '@nestjs/common';
import { ProductsService } from './products.service';
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
  getProduct(@Param('id', ParseUUIDPipe) id: string){
    return this.productsService.getProductFlattened(id);
  }
}
