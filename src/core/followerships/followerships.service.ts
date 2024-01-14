import { Injectable } from '@nestjs/common';
import { Followership, Prisma } from '@prisma/client';
import { paginator } from 'src/lib/prisma/paginator';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { UserWithoutPassword } from 'src/utils/selector.utils';

const paginate = paginator({ perPage: 20 });

@Injectable()
export class FollowershipsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getFollowers(userId: string, page?: number) {
    const followers = await paginate<
      Followership,
      Prisma.FollowershipFindManyArgs
    >(
      this.prismaService.followership,
      { page },
      {
        where: { followingId: userId },
        include: { follower: { select: UserWithoutPassword } },
      },
    );

    return followers;
  }

  async getFollowings(userId: string, page?: number) {
    const followings = await paginate<
      Followership,
      Prisma.FollowershipFindManyArgs
    >(
      this.prismaService.followership,
      { page },
      {
        where: { followerId: userId },
        include: { following: { select: UserWithoutPassword } },
      },
    );

    return followings;
  }

  async follow(followerId: string, followingId: string) {
    await this.prismaService.followership.create({
      data: { followerId, followingId },
    });
  }

  async unfollow(followerId: string, followingId: string) {
    await this.prismaService.followership.delete({
      where: {
        followerId_followingId: {
          followerId,
          followingId,
        },
      },
    });
  }
}
