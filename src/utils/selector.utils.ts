import { Prisma } from '@prisma/client';

export const UserWithoutPassword: Prisma.UserSelect = {
  id: true,
  email: true,
  username: true,
  bio: true,
  createdAt: true,
};
