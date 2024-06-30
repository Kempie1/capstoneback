import { IsEnum, IsObject, IsOptional, IsString, Min, IsInt, ValidateNested} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { sortByEnum, CategoriesEnum } from '../../utils/enums';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class GetByQueryDto {
    @IsOptional()
    @IsString()
    keyword?: string;

    @IsOptional()
    @IsEnum(CategoriesEnum)
    category?: CategoriesEnum;

    @IsEnum(sortByEnum) 
    @IsOptional()
    sortBy?: sortByEnum;

    @ApiPropertyOptional()
    @Transform(({ value }) => value ? parseInt(value, 10) : undefined)
    @IsInt()
    @Min(1)
    @IsOptional()
    page: number;

    @ApiPropertyOptional({
        type: "string",
        description: "Filters in the JSON format of { filterName: [options] }. For example, to filter by colors, use: '{\"colors\":[\"black\",\"white\"]}'",
        example: '{"colors":["Black","White"]}'
    })
    @IsObject()
    @IsOptional()
    @Transform(({ value }) => {
        try {
            return typeof value === 'string' ? JSON.parse(value) : value;
        } catch (error) {
            throw new Error('Invalid JSON format for filters');
        }
    }, { toClassOnly: true })
    filters?: { [key: string]: string[] };
}