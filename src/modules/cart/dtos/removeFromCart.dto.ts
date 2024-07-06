import { IsString, IsUUID} from 'class-validator';


export class RemoveFromCartDto {

    @IsUUID()
    @IsString()
    product: string;

}