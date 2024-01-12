import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { UsersService } from './users.service';
import {
  ResponseTemplate,
  TransformInterceptor,
} from 'src/utils/interceptors/transform.interceptor';
import { User } from '@prisma/client';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get(':username')
  @ApiOperation({ summary: 'Get user with username' })
  @UseInterceptors(TransformInterceptor)
  async getUserByUsername(
    @Param() param: { username: string },
  ): Promise<ResponseTemplate<User>> {
    const user = await this.usersService.findUserByUsername(param.username);

    return { message: 'Retrieved a user successfully', data: user! };
  }
}
