import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import {
  ResponseTemplate,
  TransformInterceptor,
} from 'src/utils/interceptors/transform.interceptor';
import { AllowAnon } from './auth.decorator';
import { AuthService } from './auth.service';
import SignInDto from './dto/signIn.dto';
import SignUpDto from './dto/signUp.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @AllowAnon()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  @UseInterceptors(TransformInterceptor)
  async signIn(
    @Body() credentials: SignInDto,
  ): Promise<ResponseTemplate<{ access_token: string }>> {
    const result = await this.authService.signIn(
      credentials.username,
      credentials.password,
    );

    return {
      message: 'Logged in successfully',
      data: result,
    };
  }

  @AllowAnon()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  @UseInterceptors(TransformInterceptor)
  async signUp(
    @Body() credentials: SignUpDto,
  ): Promise<ResponseTemplate<null>> {
    await this.authService.signUp(
      credentials.username,
      credentials.email,
      credentials.password,
    );

    return { message: 'Registered successfully', data: null };
  }
}
