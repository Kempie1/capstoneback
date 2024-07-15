
import { BadRequestException, Injectable, InternalServerErrorException, Res } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UserDto } from './dtos/user.dto';
import { InjectRepository, } from '@nestjs/typeorm';
import { User } from '../users/entities/User.entity';
import { Repository } from 'typeorm';
import { ShoppingCart } from '../cart/entities/ShoppingCart.entity';
import { randomBytes } from 'crypto';
import { PasswordReset } from './entities/PasswordReset.entity';
import { ConfigService } from '@nestjs/config';
import { EmailService } from '../email/email.service';
import { BroadcasterResult } from 'typeorm/subscriber/BroadcasterResult';
import { VerifyResetPasswordDto } from './dtos/verifyPasswordReset.dto';
import { CompleteResetPasswordDto } from './dtos/completePasswordReset.dto';
import { ResetPasswordDto } from './dtos/resetPassword.dto';

@Injectable()
export class AuthService {
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    private emailService: EmailService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(PasswordReset)
    private passwordResetRepository: Repository<PasswordReset>,
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
          throw new BadRequestException('User with that email already exists');
        }
      })
      const saltRounds = 11;
      const user = new User()
      user.email = newUser.email
      const cart = new ShoppingCart()
      cart.user = user
      bcrypt.hash(newUser.password, saltRounds, (err, hash) => {
        // Store hash in your password DB.
        user.password = hash
        this.userRepository.save(user)
        this.shoppingCartRepository.save(cart)
      })
      return { message: "User created" }
    }
    catch (error) {
      console.error('Registration error:', error);
      throw new InternalServerErrorException('Registration failed');
    }
  }

  // async createPasswordResetToken(user: User) {
  //   //generate a token for the user
  //   const token = randomBytes(16).toString('hex');
  //   const saltRounds = 10;
  //   //hash the token and store it in the database
  //   bcrypt.hash(token, saltRounds, (err, hash)  =>  {
  //     const resetToken = new PasswordReset()
  //     resetToken.token = hash
  //     resetToken.user = user
  //     resetToken.expiration = new Date(Date.now() + 900000); // 15 minutes
  //     this.passwordResetRepository.save(resetToken).then(tokenEntity => {
  //       return { tableId: tokenEntity.id, token: token };
  //     })
  //   })
  // }

  async createPasswordResetToken(user: User): Promise<{ tableId: string; token: string }> {
    try {
      const token = randomBytes(16).toString('base64url');
      const saltRounds = 10;

      const hash = await bcrypt.hash(token, saltRounds);

      const resetToken = new PasswordReset();
      resetToken.token = hash;
      resetToken.user = user;
      resetToken.expiration = new Date(Date.now() + 900000); // 15 minutes

      const tokenEntity = await this.passwordResetRepository.save(resetToken);
  
      return { tableId: tokenEntity.id, token: token };
    } catch (error) {
      console.error("Error creating password reset token:", error);
      throw new Error("Failed to create password reset token");
    }
  }

  async requestResetPassword(body: ResetPasswordDto) {
    let email = body.email;
    const user = await this.userRepository.findOne({
      where: { email: email }
    });

    if (!user) {
      console.error('User not found');
    }
    else {
      let passwordResetData = await this.createPasswordResetToken(user);
      let { tableId, token } = passwordResetData;
      let baseurl = this.configService.get<string>('FRONTEND_URL')
      const resetLink = baseurl + `/reset-password?token=${token}&id=${tableId}`;
      await this.emailService.sendForgotPasswordEmail(email, resetLink);
    }
    return { message: 'If a user with that email exists, a password reset link has been sent.' };
  }

  async verifyResetToken(body: VerifyResetPasswordDto, passwordResetEntity?: PasswordReset) {
    const { token, id } = body;
    if (!passwordResetEntity) {
      passwordResetEntity = await this.passwordResetRepository.findOne({
        where: { id: id }
      });
      if (!passwordResetEntity) {
        throw new BadRequestException('Invalid token');
      }
    }
    bcrypt.compare(token, passwordResetEntity.token, (err, result) => {
      if (err) {
        console.error('Error comparing tokens:', err);
      } else {
        return result
      }
    });
    return false
  }

  async completeResetPassword(body: CompleteResetPasswordDto) {
    const { token, id } = body;
    const passwordResetEntity = await this.passwordResetRepository.findOne({
      where: { id: id }
    });
    if (!passwordResetEntity) {
      throw new BadRequestException('Invalid token');
    }
    let validToken = await this.verifyResetToken({ token: token, id: id }, passwordResetEntity);
    if (validToken) {
      const user = passwordResetEntity.user;
      const saltRounds = 11;
      bcrypt.hash(body.password, saltRounds, (err, hash) => {
        user.password = hash
        this.userRepository.save(user)
      });
      this.emailService.sendPasswordResetEmail(user.email);
      return { message: 'Password reset successful.' };
    }
    else {
      throw new BadRequestException('Invalid token');
    }
  }
}

