import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PaginatedResult } from 'src/lib/prisma/paginator';
import { UserWithoutPasswordType } from 'src/types/users.types';
import { ResponseTemplate } from 'src/utils/interceptors/transform.interceptor';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { paginatedUsersSeeder, userSeeder } from './fixtures';

const service = {
  getUsers: jest.fn().mockResolvedValue(paginatedUsersSeeder),
  getUser: jest.fn().mockResolvedValue(userSeeder),
};

describe('UsersController', () => {
  let controller: UsersController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: service,
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      const result: ResponseTemplate<PaginatedResult<UserWithoutPasswordType>> =
        {
          message: 'Retrieved users successfully',
          result: paginatedUsersSeeder,
        };

      expect(await controller.getUsers()).toEqual(result);
    });
  });

  describe('findById', () => {
    it('should return a user by id', async () => {
      const result: ResponseTemplate<UserWithoutPasswordType> = {
        message: 'Retrieved user successfully',
        result: userSeeder,
      };

      expect(
        await controller.findById('70d1c5a7-febf-4600-a64f-3dfa68041cc5'),
      ).toEqual(result);
    });

    it('should throw NotFoundException for non-existing user', async () => {
      const userId = 'nonExistingId';

      service.getUser.mockResolvedValue(null);

      await expect(controller.findById(userId)).rejects.toThrow(
        NotFoundException,
      );
    });
  });
});
