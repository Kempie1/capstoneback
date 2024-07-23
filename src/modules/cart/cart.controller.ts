import {
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  Body,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { AddToCartDto } from './dtos/addToCart.dto';
import { EditProductInCartDto } from './dtos/editProductInCart.dto';
import { RemoveFromCartDto } from './dtos/removeFromCart.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Cart')
@ApiSecurity('bearer')
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}
  @Get()
  getCart(@Request() req) {
    return this.cartService.getCart(req);
  }
  @Post('/add')
  async addProductToCart(@Body() body: AddToCartDto, @Request() req) {
    return this.cartService.addProductToCart(req, body);
  }

  @Delete('/remove')
  async removeProductFromCart(@Body() body: RemoveFromCartDto, @Request() req) {
    return this.cartService.removeProductFromCart(req, body);
  }
  @Patch('/edit')
  async editProductInCart(@Body() body: EditProductInCartDto, @Request() req) {
    return this.cartService.editProductInCart(req, body);
  }
  @Get('/compatibility')
  async compatibilityCheck(@Request() req) {
    return this.cartService.compatibilityCheck(req);
  }
}
