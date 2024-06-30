import { IsEnum, IsOptional, Min, IsInt} from 'class-validator';
import { Transform } from 'class-transformer';
import { sortByEnum, CategoriesEnum } from '../../utils/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetByCategoryDTO {
  @IsEnum(CategoriesEnum)
  category: CategoriesEnum;

  @IsOptional()
  @IsEnum(sortByEnum) 
  sortBy?: sortByEnum;

  @ApiPropertyOptional()
  @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
  @IsInt()
  @Min(1)
  @IsOptional()
  page: number;

}
