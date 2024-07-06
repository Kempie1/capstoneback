
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dtos/user.dto';
import { InjectRepository, } from '@nestjs/typeorm';
import { User } from '../users/entities/User.entity';
import { Repository } from 'typeorm';
import { ShoppingCart } from '../cart/entities/ShoppingCart.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(ShoppingCart)
        private shoppingCartRepository: Repository<ShoppingCart>,
  ) { }

  async validateUser(email: string, pass: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.userRepository.findOneBy({ email: email }).then(user => {
        if (!user) {
          resolve(null); // User not found
          return;
        }
        bcrypt.compare(pass, user.password, (err, result) => {
          if (err) {
            reject(err); // Handle error
          } else if (result) {
            const { password, ...output } = user;
            resolve(output); // Password matches, return user data
          } else {
            resolve(null); // Password does not match
          }
        });
      }).catch(error => {
        reject(error); // Handle error from findOneBy
      });
    });
  }

  async login(user: any) {
    const payload = { sub: user.id };
    return {
      token: {
        accessToken: this.jwtService.sign(payload),
      }
    };
  }


  async register(newUser: UserDto) {
    //TODO: Return the errors
    try {
      await this.userRepository.findOneBy({ email: newUser.email }).then(user => {
        if (user) {
          throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
        }
      })
      const saltRounds = 11;
      const user = new User()
      user.email = newUser.email
      const cart= new ShoppingCart()
      cart.user=user
      bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
        // Store hash in your password DB.
        user.password = hash
        this.userRepository.save(user)
        this.shoppingCartRepository.save(cart)
      })
      return { message: "User created" }
    }
    catch (error) {
      // Log the error and rethrow or handle it as needed
      console.error('Registration error:', error);
      throw new HttpException('Registration failed', HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

}