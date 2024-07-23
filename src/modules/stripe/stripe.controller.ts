import {
  Controller,
  Request,
  Get,
  UseGuards,
  Post,
  RawBodyRequest,
} from '@nestjs/common';
import { StripeService } from './stripe.service';
import { ApiSecurity, ApiTags } from '@nestjs/swagger';
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
  async getCheckout(@Request() req: Request) {
    return await this.stripeService.getCheckout(req);
  }

  @Get('fulfill-checkout')
  async fulfillCheckout(@Request() req: Request) {
    return await this.stripeService.fulfillCheckout(req);
  }

  @Post('webhook')
  async webhook(@Request() req: RawBodyRequest<Request>) {
    return await this.stripeService.webhook(req);
  }
}
