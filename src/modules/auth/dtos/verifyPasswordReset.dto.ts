import { IsString, IsUUID } from 'class-validator';

export class VerifyResetPasswordDto {
  @IsString()
  token: string;

  @IsUUID()
  id: string;
}
