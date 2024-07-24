import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Index } from 'typeorm';
import { Product } from '../../products/entities/Product.entity';
import { ShoppingCart } from './ShoppingCart.entity';

@Entity('cart_item')
@Index(["id", "shoppingCart"], { unique: true })
export class CartItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  quantity: number;

  @ManyToOne(() => Product, { eager: true })
  product: Product;

  @ManyToOne(() => ShoppingCart, (shoppingCart) => shoppingCart.cartItems, {
    orphanedRowAction: 'delete',
  })
  shoppingCart: ShoppingCart;
}
