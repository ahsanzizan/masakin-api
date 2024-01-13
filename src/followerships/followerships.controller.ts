import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';
import { AuthUser } from 'src/auth/auth.types';
import { User } from 'src/auth/user.decorator';
import { PaginatedResult } from 'src/prisma/paginator';
import {
  ResponseTemplate,
  TransformInterceptor,
} from 'src/utils/interceptors/transform.interceptor';
import { FollowershipsService } from './followerships.service';

@Controller('followerships')
export class FollowershipsController {
  constructor(private readonly followershipsService: FollowershipsService) {}

  @HttpCode(HttpStatus.OK)
  @Get('followers')
  @ApiOperation({ summary: "Get authenticated user's followers" })
  @UseInterceptors(TransformInterceptor)
  async getFollowers(
    @User() user: AuthUser,
    @Query('page') page?: number,
  ): Promise<
    ResponseTemplate<PaginatedResult<Prisma.FollowershipDelegate<DefaultArgs>>>
  > {
    const followers = await this.followershipsService.getFollowers(
      user.sub,
      page,
    );
    return { message: 'Retrieved followers successfully', result: followers };
  }

  @HttpCode(HttpStatus.OK)
  @Get('followers/:id')
  @ApiOperation({ summary: "Get user's followers by id" })
  @UseInterceptors(TransformInterceptor)
  async getFollowersByUserId(
    @Param('id') id: string,
    @Query('page') page?: number,
  ): Promise<
    ResponseTemplate<PaginatedResult<Prisma.FollowershipDelegate<DefaultArgs>>>
  > {
    const followers = await this.followershipsService.getFollowers(id, page);
    return { message: 'Retrieved followers successfully', result: followers };
  }

  @HttpCode(HttpStatus.OK)
  @Get('followings')
  @ApiOperation({ summary: "Get authenticated user's followings" })
  @UseInterceptors(TransformInterceptor)
  async getFollowings(
    @User() user: AuthUser,
    @Query('page') page?: number,
  ): Promise<
    ResponseTemplate<PaginatedResult<Prisma.FollowershipDelegate<DefaultArgs>>>
  > {
    const followings = await this.followershipsService.getFollowings(
      user.sub,
      page,
    );
    return { message: 'Retrieved followings successfully', result: followings };
  }

  @HttpCode(HttpStatus.OK)
  @Get('followings/:id')
  @ApiOperation({ summary: "Get user's followings by id" })
  @UseInterceptors(TransformInterceptor)
  async getFollowingsByUserId(
    @Param('id') id: string,
    @Query('page') page?: number,
  ): Promise<
    ResponseTemplate<PaginatedResult<Prisma.FollowershipDelegate<DefaultArgs>>>
  > {
    const followings = await this.followershipsService.getFollowings(id, page);
    return { message: 'Retrieved followings successfully', result: followings };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('follow')
  @ApiOperation({ summary: 'Follows a user' })
  @UseInterceptors(TransformInterceptor)
  async followUser(
    @Param('id') id: string,
    @User() user: AuthUser,
  ): Promise<ResponseTemplate<null>> {
    await this.followershipsService.follow(user.sub, id);

    return { message: 'Created followership successfully', result: null };
  }

  @HttpCode(HttpStatus.CREATED)
  @Delete('follow')
  @ApiOperation({ summary: 'Follows a user' })
  @UseInterceptors(TransformInterceptor)
  async unfollowUser(
    @Param('id') id: string,
    @User() user: AuthUser,
  ): Promise<ResponseTemplate<null>> {
    await this.followershipsService.unfollow(user.sub, id);

    return { message: 'Deleted followership successfully', result: null };
  }
}
