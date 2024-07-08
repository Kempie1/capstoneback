import { IsString, IsUUID} from 'class-validator';


export class AddToCartDto {

    @IsUUID()
    @IsString()
    productId: string;

}