import {
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { CartItem } from './CartItem.entity';
import { User } from '../../users/entities/User.entity';

@Entity('shopping_cart')
export class ShoppingCart {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(() => CartItem, (cart_item) => cart_item.shoppingCart, {
    nullable: true,
    cascade: true,
  })
  cartItems: CartItem[];

  @OneToOne(() => User)
  @JoinColumn()
  user: User;
}
