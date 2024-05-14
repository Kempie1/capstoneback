import { Entity, Column, PrimaryGeneratedColumn} from 'typeorm';
import { Product } from './Product.entity';

@Entity('category')
export class Category {
    @PrimaryGeneratedColumn("uuid")
    id: string;
    
    @Column()
    name: string;


  }