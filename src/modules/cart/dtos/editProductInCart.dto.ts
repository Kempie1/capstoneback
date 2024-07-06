import { Type } from 'class-transformer';
import { IsInt, IsNumberString, isPositive, IsPositive, IsString, IsUUID} from 'class-validator';
import { IntegerType } from 'typeorm';


export class EditProductInCartDto {

    @IsUUID()
    @IsString()
    product: string;

    @IsInt()
    @IsPositive()
    @Type(() => Number)
    newQuantity: number;

}