import { Inject, Injectable, RawBodyRequest } from '@nestjs/common';
import Stripe from 'stripe';
import { CartService } from '../cart/cart.service';
import { ConfigService } from '@nestjs/config';
import { Order } from './entities/Order.entity';
import { OrderItem } from './entities/OrderItem.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/Product.entity';
import { User } from '../users/entities/User.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Order)
    private orderRepository: Repository<Order>,
    @InjectRepository(OrderItem)
    private orderItemRepository: Repository<OrderItem>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private readonly cartService: CartService,
    private readonly emailService: EmailService,
    private configService: ConfigService,
    @Inject('STRIPE_API_KEY') private readonly apiKey: string,
  ) {
    this.stripe = new Stripe(this.apiKey, {
      apiVersion: '2024-06-20', // Use whatever API latest version
    });
  }

  // async getProducts(): Promise<Stripe.Product[]> {
  //   const products = await this.stripe.products.list();
  //   return products.data;
  // }

  // async getCustomers() {
  //   const customers = await this.stripe.customers.list({});
  //   return customers.data;
  // }

  async getCheckout(req) {
    //Generate a checkout session
    //Get cart items and create a session
    const cart = await this.cartService.getCart(req, true);
    //convert cart items to stripe line items
    const lineItems = [];

    cart.cartItems.forEach(async (cartItem) => {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: cartItem.product.name,
            metadata: { id: cartItem.product.id },
          },
          unit_amount: parseFloat(cartItem.product.price) * 100,
        },
        quantity: cartItem.quantity,
      });
    });
    if (lineItems.length === 0) {
      throw new Error('No items in cart');
    }
    const baseUrl = this.configService.get<string>('FRONTEND_URL');
    const sessionURL = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      customer_email: cart.user.email,
      success_url: baseUrl + '/success?session_id={CHECKOUT_SESSION_ID}',
      cancel_url: baseUrl + '/cart',
    });
    return sessionURL.url;
  }

  async fulfillCheckout(sessionId) {
    console.log('Fulfilling Checkout Session ' + sessionId);

    // TODO: Make this function safe to run multiple times,
    // even concurrently, with the same session ID
    const existingOrder = await this.orderRepository.findOne({
      where: { stripeSessionId: sessionId },
    });

    // TODO: Make sure fulfillment hasn't already been
    // peformed for this Checkout Session

    // Retrieve the Checkout Session from the API with line_items expanded
    const checkoutSession = await this.stripe.checkout.sessions.retrieve(
      sessionId,
      {
        expand: ['line_items.data.price.product'],
      },
    );
    let order = new Order();
    let orderItems: OrderItem[] = [];
    if (!existingOrder) {
      order.stripeSessionId = sessionId;
      order.totalPrice = (checkoutSession.amount_total / 100).toFixed(2);
      order.user = await this.userRepository.findOne({
        where: { email: checkoutSession.customer_email },
      });
      const itemPromises = checkoutSession.line_items.data.map(
        async (lineItem) => {
          const item = new OrderItem();
          item.quantity = lineItem.quantity;
          if (
            typeof lineItem.price.product !== 'string' &&
            'metadata' in lineItem.price.product
          ) {
            //Create Order by using IDs
            const foundProduct = await this.productRepository.findOne({
              where: { id: lineItem.price.product.metadata.id },
            });
            item.product = foundProduct;
          }
          await this.orderItemRepository.save(item);
          orderItems.push(item);
          return item;
        },
      );
      order.orderItems = await Promise.all(itemPromises);
      order.fulfilled = false;
    } else {
      order = existingOrder;
      orderItems = existingOrder.orderItems;
    }
    if (!order.fulfilled) {
      // Check the Checkout Session's payment_status property
      // to determine if fulfillment should be peformed
      if (checkoutSession.payment_status !== 'unpaid') {
        // TODO: Perform fulfillment of the line items
        this.emailService.sendOrder(
          order.user.email,
          order.orderItems,
          order.totalPrice,
        );
        // TODO: Record/save fulfillment status for this
        // Checkout Session
        order.fulfilled = true;
      }
      await this.orderRepository.save(order);
    }
  }

  async webhook(req: RawBodyRequest<Request>) {
    try {
      const payload = req.rawBody;
      const sig = req.headers['stripe-signature'];
      const event = this.stripe.webhooks.constructEvent(
        payload,
        sig,
        this.configService.get<string>('STRIPE_WEBHOOK_SECRET'),
      );
      switch (event.type) {
        case 'checkout.session.completed':
        case 'checkout.session.async_payment_succeeded':
          // Fulfill the purchase...
          this.fulfillCheckout(event.data.object.id);
          break;
        default:
          console.log(`Unhandled event type ${event.type}`);
      }
    } catch (error) {
      console.error('Webhook error:', error);
      throw new Error('Webhook error');
    }
  }
}
