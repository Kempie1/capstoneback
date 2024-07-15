import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import config from '../config/orm.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { StripeModule } from './modules/stripe/stripe.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { EmailModule } from './modules/email/email.module';
import mailerConfig from 'config/email.config';


@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ProductsModule,
    UsersModule,
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    CartModule,
    OrdersModule,
    StripeModule.forRootAsync(),
    MailerModule.forRoot(mailerConfig),
    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
