import {
  Column,
  Entity,
  CreateDateColumn,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  Index,
} from 'typeorm';
import { User } from '../../users/entities/User.entity';

@Entity('password_reset')
export class PasswordReset {
  @PrimaryGeneratedColumn('uuid')
  @Index()
  id: string;

  @Column()
  token: string;

  @CreateDateColumn()
  expiration: Date;

  @ManyToOne(() => User)
  @JoinColumn()
  user: User;
}
