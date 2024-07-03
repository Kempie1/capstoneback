import { Controller, Get, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import {
  ApiResponse,
  ApiTags
} from '@nestjs/swagger';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly productsService: UsersService) {}

}
