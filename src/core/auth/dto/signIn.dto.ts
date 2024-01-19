import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class SignInDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Username used to sign up' })
  username: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({ description: 'Password used to sign up' })
  password: string;
}

export default SignInDto;
