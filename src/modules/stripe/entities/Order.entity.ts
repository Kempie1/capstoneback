import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/User.entity';
import { OrderItem } from './OrderItem.entity';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  stripeSessionId: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalPrice: string;

  @OneToMany(() => OrderItem, (order_item) => order_item.order)
  orderItems: OrderItem[];

  @Column()
  fulfilled: boolean;

  @ManyToOne(() => User)
  user: User;
}
