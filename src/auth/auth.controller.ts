import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import SignInDto from './dto/signIn.dto';
import SignUpDto from './dto/signUp.dto';
import { AllowAnon } from './auth.decorator';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @AllowAnon()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  signIn(@Body() credentials: SignInDto) {
    return this.authService.signIn(credentials.username, credentials.password);
  }

  @AllowAnon()
  @HttpCode(HttpStatus.CREATED)
  @Post('register')
  signUp(@Body() credentials: SignUpDto) {
    return this.authService.signUp(
      credentials.username,
      credentials.email,
      credentials.password,
    );
  }
}
