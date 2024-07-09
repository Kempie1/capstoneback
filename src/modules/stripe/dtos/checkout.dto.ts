import { IsUUID } from 'class-validator';
import { Transform } from 'class-transformer';

export class CheckoutDto {
    @IsUUID()
    @Transform((param) => param.value.toLowerCase())
    cartId: string;
  }