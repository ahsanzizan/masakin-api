import {
  BadRequestException,
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
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Prisma, User } from '@prisma/client';
import { PaginatedResult } from 'src/lib/prisma/paginator';
import { UserWithoutPasswordType } from 'src/types/users.types';
import { ResponseTemplate } from 'src/utils/interceptors/transform.interceptor';
import { UserWithoutPassword } from 'src/utils/selector.utils';
import { UseAuth } from '../auth/auth.decorator';
import { AuthUser } from '../auth/auth.types';
import { UpdateUserDto } from './dto/updateUser.dto';
import { UsersService } from './users.service';
import { CloudinaryService } from 'src/lib/cloudinary/cloudinary.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileSizeGuard } from 'src/utils/guards/fileSize.guard';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

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
  @Patch('me')
  @ApiOperation({ summary: 'Update current authorized user' })
  @UseGuards(new FileSizeGuard(5 * 1024 * 1024))
  @UseInterceptors(FileInterceptor('avatar'))
  async updateCurrentUser(
    @UseAuth() user: AuthUser,
    @Body() data: UpdateUserDto,
    @UploadedFile() avatar?: Express.Multer.File,
  ) {
    const userUpdateData: Prisma.UserUpdateInput = { ...data, avatar: null };

    if (avatar) {
      const uploadAvatarToCloudinary = await this.cloudinaryService
        .uploadImage(avatar)
        .catch(() => {
          throw new BadRequestException('Invalid file type');
        });
      const avatarUrl = uploadAvatarToCloudinary.url as string;
      userUpdateData.avatar = avatarUrl;
    }

    return {
      message: 'Updated user successfully',
      result: await this.usersService.updateUser(
        { id: user.sub },
        userUpdateData,
      ),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Delete('me')
  @ApiOperation({ summary: 'Delete current authorized user by id' })
  async deleteCurrentUser(
    @UseAuth() user: AuthUser,
  ): Promise<ResponseTemplate<User>> {
    return {
      message: 'Deleted user successfully',
      result: await this.usersService.deleteUser({ id: user.sub }),
    };
  }
}
