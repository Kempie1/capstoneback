
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
import { EmailService } from '../email/email.service';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { VerifyResetPasswordDto } from './dtos/verifyPasswordReset.dto';
import { CompleteResetPasswordDto } from './dtos/completePasswordReset.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
    private emailService: EmailService
  ) { }

  @ApiSecurity('bearer')
  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req) {
    return this.userService.getUser(req.user.userId);
  }

  @Post('register')
  async register(@Body() newUser: UserDto) {
    return this.authService.register(newUser);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiBody({ type: UserDto })
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('request-password-reset')
  async requestResetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.requestResetPassword(body);
  }

  @Post('verify-password-reset')
  async verifytResetPassword(@Body() body: VerifyResetPasswordDto) {
    if (this.authService.verifyResetToken(body)) {
      return {validToken: true};
    }
    return {validToken: false};
  }

  @Post('complete-password-reset')
  async completeResetPassword(@Body() body: CompleteResetPasswordDto) {
    return this.authService.completeResetPassword(body);
  }
}
