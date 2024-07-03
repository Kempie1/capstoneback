import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { Category } from './Category.entity';
import { ProductCharacteristic } from './ProductCharacteristic.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  imgUrl: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: string;

  @ManyToMany(() => Category, { eager: true })
  @JoinTable()
  categories: Category[];

  @ManyToMany(
    () => ProductCharacteristic,
    (productCharacteristic) => productCharacteristic.products,
  )
  productCharacteristics: ProductCharacteristic[];
}
