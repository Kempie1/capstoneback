import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductsModule } from './modules/products/products.module';
import { UsersModule } from './modules/users/users.module';
import config from '../orm.config';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';


@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    ProductsModule,
    UsersModule,
    ConfigModule.forRoot(),
    UsersModule,
    AuthModule,
    CartModule,
    OrdersModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
