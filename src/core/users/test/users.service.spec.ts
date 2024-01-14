import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { UsersService } from '../users.service';
import { paginatedUsersSeeder, userSeeder, usersSeeder } from './fixtures';

const db = {
  user: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn().mockReturnValue(userSeeder),
    update: jest.fn().mockReturnValue(userSeeder),
    delete: jest.fn().mockResolvedValue(userSeeder),
    count: jest.fn().mockResolvedValue(paginatedUsersSeeder.data.length),
  },
};

describe('UsersService', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let service: UsersService;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  let prisma: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: db,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getUsers', () => {
    it('should return paginated users', async () => {
      db.user.findMany.mockImplementation(async (args) => {
        if (args?.select) {
          return paginatedUsersSeeder.data;
        } else {
          return usersSeeder;
        }
      });

      const users = await service.getUsers({});
      expect(users).toEqual(paginatedUsersSeeder);
    });
  });

  describe('getUser', () => {
    it('should return a user when found', async () => {
      db.user.findUnique.mockResolvedValue(userSeeder);

      const user = await service.getUser({ id: userSeeder.id });
      expect(user).toEqual(userSeeder);
    });
  });

  describe('createUser', () => {
    it('should create a user', () => {
      expect(
        service.createUser({
          username: userSeeder.username,
          email: userSeeder.email,
          password: userSeeder.password,
        }),
      ).resolves.toEqual(userSeeder);
    });
  });
});
