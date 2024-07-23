import {
  Body,
  Controller,
  Post,
  UseGuards,
  Request,
  Get,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { ApiBody, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { UserDto } from './dtos/user.dto';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ResetPasswordDto } from './dtos/resetPassword.dto';
import { VerifyResetPasswordDto } from './dtos/verifyPasswordReset.dto';
import { CompleteResetPasswordDto } from './dtos/completePasswordReset.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Get('session')
  getSessionInfo(@Request() req) {
    return req.user;
  }

  // TODO Implenet session invalidation
  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout() {
    // @Request() req
    // Invalidate the session token or perform other cleanup actions
    // return this.authService.logout(req.user);
  }

  @Post('request-password-reset')
  async requestResetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.requestResetPassword(body);
  }

  @Post('verify-password-reset')
  async verifytResetPassword(@Body() body: VerifyResetPasswordDto) {
    const result = await this.authService.verifyResetToken(body);
    return { validToken: result };
  }

  @Post('complete-password-reset')
  async completeResetPassword(@Body() body: CompleteResetPasswordDto) {
    return this.authService.completeResetPassword(body);
  }
}
