import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToMany,
  ManyToOne,
  JoinTable,
} from 'typeorm';
import { Product } from './Product.entity';
import { Characteristic } from './Characteristic.entity';

@Entity('product_characteristic')
export class ProductCharacteristic {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  value: string;

  @ManyToMany(() => Product, (product) => product.productCharacteristics)
  @JoinTable()
  products: Product[];

  @ManyToOne(() => Characteristic, { eager: true })
  characteristic: Characteristic[];
}
