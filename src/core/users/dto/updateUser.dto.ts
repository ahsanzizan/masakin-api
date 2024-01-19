import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  IsStrongPassword,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  username?: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @ApiPropertyOptional()
  email?: string;

  @IsOptional()
  @IsString()
  @IsStrongPassword()
  @ApiPropertyOptional()
  password?: string;

  @IsOptional()
  @IsString()
  @ApiPropertyOptional()
  bio?: string;
}
