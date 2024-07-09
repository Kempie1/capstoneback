import { Inject, Injectable } from '@nestjs/common';
import Stripe from 'stripe';
import { CartService } from '../cart/cart.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private readonly cartService: CartService,
    private configService: ConfigService,
    @Inject('STRIPE_API_KEY') private readonly apiKey: string) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2024-06-20', // Use whatever API latest version
    });
    
  }

  async getProducts(): Promise<Stripe.Product[]> {
    const products = await this.stripe.products.list();
    return products.data;
  }

  async getCustomers() {
    const customers = await this.stripe.customers.list({});
    return customers.data;
  }
  
  async getCheckout(req) {
    //Generate a checkout session
    //Get cart items and create a session
    let cart = await this.cartService.getCart(req);
    
    //convert cart items to stripe line items
    let lineItems = [];
    cart.cartItems.forEach(async (cartItem) => {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: cartItem.product.name,
          },
          unit_amount: parseFloat(cartItem.product.price) * 100,
        },
        quantity: cartItem.quantity,
      });
    });
    let baseUrl= this.configService.get<string>('FRONTEND_URL')
    const sessionURL = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: baseUrl + '/success',
      cancel_url: baseUrl + '/cancel',
    });
    return sessionURL.url;
  }
}