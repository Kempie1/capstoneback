import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from './entities/Product.entity';
import { Characteristic } from './entities/Characteristic.entity';
import { ProductCharacteristic } from './entities/ProductCharacteristic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Product, Characteristic, ProductCharacteristic]),
  ],
  providers: [ProductsService],
  controllers: [ProductsController],
  exports: [TypeOrmModule],
})
export class ProductsModule {}
