import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, JoinTable } from 'typeorm';
import { Category } from './Category.entity';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  imgUrl: string;

  @ManyToMany(() => Category, {eager: true})
  @JoinTable()
  categories: Category[]
}