import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import SignInDto from './dto/signIn.dto';
import SignUpDto from './dto/signUp.dto';
import { AllowAnon } from './auth.decorator';
import { ApiOperation } from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @AllowAnon()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  async signIn(@Body() credentials: SignInDto) {
    const result = await this.authService.signIn(
      credentials.username,
      credentials.password,
    );

    return {
      message: 'Logged in successfully',
      result,
    };
  }

  @AllowAnon()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  @ApiOperation({ summary: 'User registration' })
  async signUp(@Body() credentials: SignUpDto) {
    await this.authService.signUp(
      credentials.username,
      credentials.email,
      credentials.password,
    );

    return { message: 'Registered successfully' };
  }
}
