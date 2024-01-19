import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
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

export class CreateRecipeDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  title: string;

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

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty()
  cookDuration: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  price: number;

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

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  @ApiProperty()
  servings: number;

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

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ description: 'Stringified version of the ingredients object' })
  ingredientsString: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => Ingredient)
  get ingredients(): Ingredient[] {
    try {
      return JSON.parse(this.ingredientsString);
    } catch (error) {
      return [];
    }
  }
}
