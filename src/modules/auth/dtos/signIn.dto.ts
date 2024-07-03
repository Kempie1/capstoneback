import { IsEmail, IsNotEmpty, MinLength, IsStrongPassword, IsStrongPasswordOptions } from 'class-validator';

export class UserDto {
    @IsEmail()
    email: string;
  
    @IsNotEmpty()
    @MinLength(8)
    @IsStrongPassword({ minLength: 8, minLowercase: 1, minUppercase: 1, minNumbers: 1, minSymbols: 1 })
    password: string;
  }