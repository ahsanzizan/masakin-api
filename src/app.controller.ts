import { Controller, Get, HttpCode, HttpStatus } from '@nestjs/common';
import { AllowAnon } from './core/auth/auth.decorator';

@Controller()
export class AppController {
  @HttpCode(HttpStatus.OK)
  @Get()
  @AllowAnon()
  async getRecipeById() {
    return {
      message: 'Welcome to Masakin Official API',
      version: '1.0',
    };
  }
}
