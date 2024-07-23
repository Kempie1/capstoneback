import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  IsStrongPassword,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class UserDto {
  @IsEmail()
  @Transform((param) => param.value.toLowerCase())
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  @IsStrongPassword({
    minLength: 8,
    minLowercase: 1,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
  })
  password: string;
}
