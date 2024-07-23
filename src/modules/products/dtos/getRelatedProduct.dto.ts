import { IsString, IsUUID } from 'class-validator';

export class GetRelatedProductDTO {
  @IsUUID()
  id: string;

  @IsString()
  name: string;
}
