import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  Name: string;

  @Column()
  Description: string;

  @Column({ default: true })
  onSale: boolean;
}