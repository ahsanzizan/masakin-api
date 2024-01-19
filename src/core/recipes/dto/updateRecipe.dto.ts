import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

class Ingredient {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsInt()
  amount: number;

  @IsNotEmpty()
  @IsString()
  unit: string;

  @IsNotEmpty()
  @IsString()
  unitShort: string;
}

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  title?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  description?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @ApiPropertyOptional()
  vegetarian?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  @ApiPropertyOptional()
  vegan?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @ApiPropertyOptional()
  cookDuration?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @ApiPropertyOptional()
  price?: number;

  @IsOptional()
  @IsBoolean()
  @Transform((val) => Boolean(val))
  @ApiPropertyOptional()
  healthy?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform((val) => Boolean(val))
  @ApiPropertyOptional()
  sustainable?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @ApiPropertyOptional()
  servings?: number;

  @IsOptional()
  @IsBoolean()
  @Transform((val) => Boolean(val))
  @ApiPropertyOptional()
  dairyFree?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform((val) => Boolean(val))
  @ApiPropertyOptional()
  glutenFree?: boolean;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional({
    description: 'Stringified version of the ingredients object',
  })
  ingredientsString?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Ingredient)
  get ingredients(): Ingredient[] {
    try {
      if (this.ingredientsString) return JSON.parse(this.ingredientsString);
      return [];
    } catch (error) {
      return [];
    }
  }
}
