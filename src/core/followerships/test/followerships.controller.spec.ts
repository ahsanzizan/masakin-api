import { Test } from '@nestjs/testing';
import { FollowershipsController } from '../followerships.controller';
import { FollowershipsService } from '../followerships.service';
import { followershipSeeder, paginatedFollowershipsSeeder } from './fixtures';
import { ResponseTemplate } from 'src/utils/interceptors/transform.interceptor';
import { PaginatedResult } from 'src/lib/prisma/paginator';
import { Followership } from '@prisma/client';
import { authUserMock } from 'src/utils/mocks/auth.mocks';

const service = {
  getFollowers: jest.fn().mockResolvedValue(paginatedFollowershipsSeeder),
  getFollowings: jest.fn().mockResolvedValue(paginatedFollowershipsSeeder),
  follow: jest.fn().mockResolvedValue(followershipSeeder),
  unfollow: jest.fn().mockResolvedValue(followershipSeeder),
};

describe('FollowershipsController', () => {
  let controller: FollowershipsController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [FollowershipsController],
      providers: [
        {
          provide: FollowershipsService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<FollowershipsController>(FollowershipsController);
  });

  describe('getFollowers', () => {
    it("should return the current user's followers", async () => {
      const result: ResponseTemplate<PaginatedResult<Followership>> = {
        message: 'Retrieved followers successfully',
        result: paginatedFollowershipsSeeder,
      };

      expect(await controller.getFollowers(authUserMock)).toEqual(result);
    });
  });

  describe('getFollowings', () => {
    it("should return the current user's followings", async () => {
      const result: ResponseTemplate<PaginatedResult<Followership>> = {
        message: 'Retrieved followings successfully',
        result: paginatedFollowershipsSeeder,
      };

      expect(await controller.getFollowings(authUserMock)).toEqual(result);
    });
  });

  describe('getFollowersByUserId', () => {
    it("should return the related user's followers", async () => {
      const result: ResponseTemplate<PaginatedResult<Followership>> = {
        message: 'Retrieved followers successfully',
        result: paginatedFollowershipsSeeder,
      };

      expect(await controller.getFollowersByUserId(authUserMock.sub)).toEqual(
        result,
      );
    });
  });

  describe('getFollowingsByUserId', () => {
    it("should return the related user's followings", async () => {
      const result: ResponseTemplate<PaginatedResult<Followership>> = {
        message: 'Retrieved followings successfully',
        result: paginatedFollowershipsSeeder,
      };

      expect(await controller.getFollowingsByUserId(authUserMock.sub)).toEqual(
        result,
      );
    });
  });
});
