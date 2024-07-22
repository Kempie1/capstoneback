import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    ManyToOne,
  } from 'typeorm';
  import { Product } from '../../products/entities/Product.entity';
  import { ShoppingCart } from './ShoppingCart.entity';
  
  @Entity('cart_item')
  export class CartItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;
  
    @Column()
    quantity: number;
  
    @ManyToOne(() => Product, {eager: true})
    product: Product;

    @ManyToOne(() => ShoppingCart, (shoppingCart) => shoppingCart.cartItems, {orphanedRowAction: 'delete'})
    shoppingCart: ShoppingCart;
  }
  