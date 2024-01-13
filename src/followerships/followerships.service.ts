import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginator } from 'src/prisma/paginator';
import { PrismaService } from 'src/prisma/prisma.service';

const paginate = paginator({ perPage: 20 });

@Injectable()
export class FollowershipsService {
  constructor(private readonly prismaService: PrismaService) {}

  async getFollowers(userId: string, page?: number) {
    const followers = await paginate<
      typeof this.prismaService.followership,
      Prisma.FollowershipFindManyArgs
    >(
      this.prismaService.followership,
      { page },
      { where: { followingId: userId }, include: { follower: true } },
    );

    return followers;
  }

  async getFollowings(userId: string, page?: number) {
    const followings = await paginate<
      typeof this.prismaService.followership,
      Prisma.FollowershipFindManyArgs
    >(
      this.prismaService.followership,
      { page },
      { where: { followerId: userId }, include: { following: true } },
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
