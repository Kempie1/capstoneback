import { IsEmail } from 'class-validator';
import { Transform } from 'class-transformer';

export class ResetPasswordDto {
  @IsEmail()
  @Transform((param) => param.value.toLowerCase())
  email: string;
}
