  import {
    IsEnum,
    IsNumber,
    IsOptional,
    IsString,
    Min,
  } from 'class-validator';
  import { sortByEnum } from '../../utils/enums'
  
  export class GetByCategoryDTO {
    @IsString()
    category: string;

    @IsNumber()
    @Min(0)
    @IsOptional()
    page: number;
  
    @IsEnum( sortByEnum )
    sortBy: sortByEnum;
  }
 