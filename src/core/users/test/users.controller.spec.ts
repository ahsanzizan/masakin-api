import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PaginatedResult } from 'src/lib/prisma/paginator';
import { UserWithoutPasswordType } from 'src/types/users.types';
import { ResponseTemplate } from 'src/utils/interceptors/transform.interceptor';
import { UsersController } from '../users.controller';
import { UsersService } from '../users.service';
import { paginatedUsersSeeder, userSeeder } from './fixtures';
import { User } from '@prisma/client';
import { authUserMock } from 'src/utils/mocks/auth.mocks';
import { CloudinaryService } from 'src/lib/cloudinary/cloudinary.service';

const service = {
  getUsers: jest.fn().mockResolvedValue(paginatedUsersSeeder),
  getUser: jest.fn().mockResolvedValue(userSeeder),
  updateUser: jest.fn(),
  deleteUser: jest.fn(),
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
        CloudinaryService,
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

  describe('updateCurrentUser', () => {
    it('should update the current user', async () => {
      const updateUser: User = {
        ...userSeeder,
        bio: 'test',
      };

      service.updateUser.mockResolvedValue(updateUser);

      const result: ResponseTemplate<User> = {
        message: 'Updated user successfully',
        result: updateUser,
      };

      expect(
        await controller.updateCurrentUser(authUserMock, { bio: 'test' }),
      ).toEqual(result);
    });
  });

  describe('deleteCurrentUser', () => {
    it('should delete the current user', async () => {
      service.deleteUser.mockResolvedValue(userSeeder);

      const result: ResponseTemplate<User> = {
        message: 'Deleted user successfully',
        result: userSeeder,
      };

      expect(
        await controller.deleteCurrentUser({
          sub: userSeeder.id,
          username: userSeeder.username,
          email: userSeeder.email,
          createdAt: userSeeder.createdAt,
        }),
      ).toEqual(result);
    });
  });
});
