import { Type } from 'class-transformer';
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
  vegetarian?: boolean;

  @IsOptional()
  @IsBoolean()
  vegan?: boolean;

  @IsNotEmpty()
  @IsNumber()
  cookDuration: number;

  @IsNotEmpty()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsBoolean()
  healthy?: boolean;

  @IsOptional()
  @IsBoolean()
  sustainable?: boolean;

  @IsNotEmpty()
  @IsNumber()
  servings: number;

  @IsOptional()
  @IsBoolean()
  dairyFree?: boolean;

  @IsOptional()
  @IsBoolean()
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
