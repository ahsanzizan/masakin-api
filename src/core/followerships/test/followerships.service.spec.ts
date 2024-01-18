import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { FollowershipsService } from '../followerships.service';
import {
  followershipSeeder,
  followershipsSeeder,
  paginatedFollowershipsSeeder,
} from './fixtures';
import { userSeeder } from 'src/core/users/test/fixtures';

const db = {
  followership: {
    findMany: jest.fn(),
    create: jest.fn().mockReturnValue(followershipSeeder),
    update: jest.fn(),
    delete: jest.fn().mockResolvedValue(followershipSeeder),
    count: jest
      .fn()
      .mockResolvedValue(paginatedFollowershipsSeeder.data.length),
  },
  user: {
    findUnique: jest.fn().mockResolvedValue(userSeeder),
  },
};

describe('FollowershipsService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: FollowershipsService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FollowershipsService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<FollowershipsService>(FollowershipsService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getFollowers', () => {
    it('should return the followers of a user', async () => {
      db.followership.findMany.mockResolvedValue(followershipsSeeder);

      const result = paginatedFollowershipsSeeder;

      const followers = await service.getFollowers(followershipSeeder.id);
      expect(followers).toEqual(result);
    });
  });

  describe('getFollowings', () => {
    it('should return the followings of the current authorized user', async () => {
      db.followership.findMany.mockResolvedValue(followershipsSeeder);

      const result = paginatedFollowershipsSeeder;

      const followings = await service.getFollowings(followershipSeeder.id);
      expect(followings).toEqual(result);
    });
  });

  describe('follow', () => {
    it('should create a new followership entity', async () => {
      db.followership.create.mockResolvedValue(followershipSeeder);

      const follow = await service.follow(
        followershipSeeder.followerId,
        followershipsSeeder[1].followingId,
      );
      expect(follow).toEqual(followershipSeeder);
    });
  });

  describe('unfollow', () => {
    it('should delete a related followership entity', async () => {
      const unfollow = await service.unfollow(
        followershipSeeder.followerId,
        followershipsSeeder[1].followingId,
      );
      expect(unfollow).toEqual(followershipSeeder);
    });
  });
});
