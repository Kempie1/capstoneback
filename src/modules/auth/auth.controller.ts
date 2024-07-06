
import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import {
  ApiBody,
    ApiSecurity,
    ApiTags
  } from '@nestjs/swagger';
import { UserDto } from './dtos/user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService
  ) {}

  @ApiSecurity('bearer')
  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req) {
    return this.userService.findOne(req.user.userId);
  }

  @Post('register')
  async register(@Body() newUser: UserDto) {
    return this.authService.register(newUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({type: UserDto})
  async login(@Request() req) {
    return this.authService.login(req.user);
  }
}
