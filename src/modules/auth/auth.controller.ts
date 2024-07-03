
import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  ApiBody,
    ApiResponse,
    ApiTags
  } from '@nestjs/swagger';
import { UserDto } from './dtos/signIn.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // @HttpCode(HttpStatus.OK)
  // @Post('login')
  // signIn(@Body() signInDto: SignInDTO) {
  //   return this.authService.signIn(signInDto.username, signInDto.password);
  // }

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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    console.log(req.user)
    return req.user;
  }
}
