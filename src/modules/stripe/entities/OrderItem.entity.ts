import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from '../../products/entities/Product.entity';
import { Order } from './Order.entity';

@Entity('order_item')
export class OrderItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @ManyToOne(() => Order, (order) => order.orderItems)
  order: Order;
}
