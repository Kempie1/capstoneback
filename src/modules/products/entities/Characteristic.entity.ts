import { Entity, Column, PrimaryGeneratedColumn, Index } from 'typeorm';

@Entity('characteristic')
export class Characteristic {
  @Index()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
