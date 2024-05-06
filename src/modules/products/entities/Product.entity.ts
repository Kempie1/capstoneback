import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

@Entity('product')
export class Product {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;

  @Column()
  imgUrl: string;
}