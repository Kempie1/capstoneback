import { Type } from 'class-transformer';
import { IsInt, IsPositive } from 'class-validator';
import { AddToCartDto } from './addToCart.dto';

export class EditProductInCartDto extends AddToCartDto {
  @IsInt()
  @IsPositive()
  @Type(() => Number)
  newQuantity: number;
}
