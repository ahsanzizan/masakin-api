import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';

class Ingredient {
  @IsNotEmpty()
  @IsUUID()
  id?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsInt()
  amount?: number;

  @IsOptional()
  @IsString()
  unit?: string;

  @IsOptional()
  @IsString()
  unitShort?: string;
}

export class UpdateRecipeDto {
  @IsOptional()
  @IsString()
  title?: string;

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

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  cookDuration?: number;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  price?: number;

  @IsOptional()
  @IsBoolean()
  @Transform((val) => Boolean(val))
  healthy?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform((val) => Boolean(val))
  sustainable?: boolean;

  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  servings?: number;

  @IsOptional()
  @IsBoolean()
  @Transform((val) => Boolean(val))
  dairyFree?: boolean;

  @IsOptional()
  @IsBoolean()
  @Transform((val) => Boolean(val))
  glutenFree?: boolean;

  @IsOptional()
  @IsString()
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
