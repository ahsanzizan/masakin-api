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
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  vegetarian?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => Boolean(value))
  vegan?: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  cookDuration: number;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  price: number;

  @IsOptional()
  @IsBoolean()
  @Transform((val) => Boolean(val))
  healthy?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform((val) => Boolean(val))
  sustainable?: boolean;

  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  servings: number;

  @IsOptional()
  @IsBoolean()
  @Transform((val) => Boolean(val))
  dairyFree?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform((val) => Boolean(val))
  glutenFree?: boolean;

  @IsNotEmpty()
  @IsString()
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
