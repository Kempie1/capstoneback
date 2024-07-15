
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

  async getUser(sub: string): Promise<User | undefined> {
    return this.userRepository.findOne({
        where:{id: sub}, select: ["id", "email"]
      });
  }
}
