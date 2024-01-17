import { User } from '@prisma/client';
import { PaginatedResult } from 'src/lib/prisma/paginator';
import { UserWithoutPasswordType } from 'src/types/users.types';

export const usersSeeder: User[] = [
  {
    id: '70d1c5a7-febf-4600-a64f-3dfa68041cc5',
    username: 'Test User 1',
    email: 'testing1@user.com',
    updatedAt: new Date(),
    createdAt: new Date(),
    password: 'testing',
    bio: null,
  },
  {
    id: '20d1c5a7-febf-4600-a64f-35fx68041cc5',
    username: 'Test User 2',
    email: 'testing2@user.com',
    updatedAt: new Date(),
    createdAt: new Date(),
    password: 'testing',
    bio: null,
  },
  {
    id: '70d1d5n7-feby-46a0-b6nf-3dfa68041cc5',
    username: 'Test User 3',
    email: 'testing3@user.com',
    updatedAt: new Date(),
    createdAt: new Date(),
    password: 'testing',
    bio: null,
  },
];

export const paginatedUsersSeeder: PaginatedResult<UserWithoutPasswordType> = {
  data: usersSeeder.map((user) => ({ ...user, password: undefined })),
  meta: {
    total: usersSeeder.length,
    lastPage: 1,
    currentPage: 1,
    perPage: 10,
    prev: null,
    next: null,
  },
};

export const userSeeder: User = usersSeeder[0];
