import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('characteristic')
export class Characteristic {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column()
  name: string;
}