import { Body, Controller, Request, Get, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
import { CheckoutDto } from './dtos/checkout.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('Stripe')
@Controller('stripe')
export class StripeController {
  constructor(private stripeService: StripeService) {}


  // @Get('products')
  // async getProducts() {
  //   return await this.stripeService.getProducts();
  // }

  // @Get('customers')
  // async getCustomers() {
  //   return await this.stripeService.getCustomers();
  // }

  @ApiSecurity('bearer')
  @UseGuards(JwtAuthGuard)
  @Get('checkout')
  async getCheckout(@Request() req) {
    return await this.stripeService.getCheckout(req);
  }
}