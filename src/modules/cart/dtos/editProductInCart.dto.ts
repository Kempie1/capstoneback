import { Type } from 'class-transformer';
import { IsInt, IsNumberString, isPositive, IsPositive, IsString, IsUUID} from 'class-validator';
import { IntegerType } from 'typeorm';
import { AddToCartDto } from './addToCart.dto';


export class EditProductInCartDto extends AddToCartDto{

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    newQuantity: number;

}