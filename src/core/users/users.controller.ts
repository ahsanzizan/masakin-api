import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Query,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { PaginatedResult } from 'src/lib/prisma/paginator';
import { UserWithoutPasswordType } from 'src/types/users.types';
import { ResponseTemplate } from 'src/utils/interceptors/transform.interceptor';
import { UserWithoutPassword } from 'src/utils/selector.utils';
import { UseAuth } from '../auth/auth.decorator';
import { AuthUser } from '../auth/auth.types';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Get users' })
  async getUsers(
    @Query('page') page?: number,
  ): Promise<ResponseTemplate<PaginatedResult<UserWithoutPasswordType>>> {
    return {
      message: 'Retrieved users successfully',
      result: await this.usersService.getUsers({
        page,
      }),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Find user by id' })
  async findById(
    @Param('id') id: string,
  ): Promise<ResponseTemplate<UserWithoutPasswordType>> {
    const user = await this.usersService.getUser({ id }, UserWithoutPassword);
    if (!user) throw new NotFoundException(`No user found with id: ${id}`);

    return { message: 'Retrieved user successfully', result: user };
  }

  @HttpCode(HttpStatus.OK)
  @Patch()
  @ApiOperation({ summary: 'Update user by id' })
  async updateCurrentUser(
    @UseAuth() user: AuthUser,
    @Body() data: UpdateUserDto,
  ): Promise<ResponseTemplate<User>> {
    return {
      message: 'Updated user successfully',
      result: await this.usersService.updateUser({ id: user.sub }, data),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  @ApiOperation({ summary: 'Delete user by id' })
  async deleteCurrentUser(
    @UseAuth() user: AuthUser,
  ): Promise<ResponseTemplate<User>> {
    return {
      message: 'Deleted user successfully',
      result: await this.usersService.deleteUser({ id: user.sub }),
    };
  }
}
