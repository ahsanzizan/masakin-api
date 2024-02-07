import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginator } from 'src/lib/prisma/paginator';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import {
  FollowershipWithFollower,
  FollowershipWithFollowing,
} from 'src/types/followerships.type';
import { UserWithoutPassword } from 'src/utils/selector.utils';
import { validateEntityById } from 'src/utils/validators.utils';

const paginate = paginator({ perPage: 20 });

@Injectable()
export class FollowershipsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getFollowers(userId: string, page?: number) {
    return await paginate<
      FollowershipWithFollower,
      Prisma.FollowershipFindManyArgs
    >(
      this.prismaService.followership,
      { page },
      {
        where: { followingId: userId },
        include: { follower: { select: UserWithoutPassword } },
      },
    );
  }

  async getFollowings(userId: string, page?: number) {
    return await paginate<
      FollowershipWithFollowing,
      Prisma.FollowershipFindManyArgs
    >(
      this.prismaService.followership,
      { page },
      {
        where: { followerId: userId },
        include: { following: { select: UserWithoutPassword } },
      },
    );
  }

  async follow(followerId: string, followingId: string) {
    if (!(await validateEntityById(followingId, 'User')))
      throw new NotFoundException(`No user found with id: ${followingId}`);

    return await this.prismaService.followership.create({
      data: { followerId, followingId },
    });
  }

  async unfollow(followerId: string, followingId: string) {
    if (!(await validateEntityById(followingId, 'User')))
      throw new NotFoundException(`No user found with id: ${followingId}`);

    return await this.prismaService.followership.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }
}
