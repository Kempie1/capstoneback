
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/User.entity';
import { Repository } from 'typeorm';


@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) { }

  async findOne(sub: string): Promise<User | undefined> {
    return this.userRepository.createQueryBuilder("user")
    .select(["user.id", "user.email",]) //DO NOT RETURN THE PASSWORD
    .getOne()
  }
}
