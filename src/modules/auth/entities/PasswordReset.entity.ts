import { Column, Entity, CreateDateColumn, UpdateDateColumn, PrimaryGeneratedColumn, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/User.entity';

@Entity('password_reset')
export class PasswordReset {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    token: string; 

    @CreateDateColumn()
    expiration: Date

    @ManyToOne(() => User)
    @JoinColumn()
    user: User;
}