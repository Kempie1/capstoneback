import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, ManyToOne, JoinTable, JoinColumn} from 'typeorm';
import { Product } from './Product.entity';
import { Characteristic } from './Characteristic.entity';

@Entity('Product_characteristic')
export class ProductCharacteristic {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    value: string;

    @ManyToMany(() => Product, {eager: true})
    @JoinTable()
    products: Product[]

    @ManyToOne(()  => Characteristic, {eager: true})
    characteristic: Characteristic[]
  }