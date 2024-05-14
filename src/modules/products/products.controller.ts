import { Controller, Get, Param, ParseUUIDPipe, Body  } from '@nestjs/common';
import { ProductsService } from './products.service';
import { Product } from './entities/Product.entity';
import { sortByEnum } from '../utils/enums'
import { GetByCategoryDTO } from './dtos/getCategory.dto';

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
  getProductByCategory(
    @Body() body: GetByCategoryDTO,
  ) {
   
    return this.productsService.get(body)
    // return this.productsService.getProduct(id);
  }
}
