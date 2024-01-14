import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginator } from 'src/lib/prisma/paginator';
import { PrismaService } from 'src/lib/prisma/prisma.service';

const paginate = paginator({ perPage: 10 });

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers(
    where?: Prisma.UserWhereInput,
    orderBy?: Prisma.UserOrderByWithRelationInput,
    page?: number,
  ) {
    return await paginate<typeof this.prismaService.user, Prisma.UserFindManyArgs>(
      this.prismaService.user,
      { page },
      { where, orderBy },
    );
  }

  async getUser(where: Prisma.UserWhereUniqueInput) {
    const findUser = await this.prismaService.user.findUnique({ where });

    return findUser;
  }

  async createUser(data: Prisma.UserCreateInput, include?: Prisma.UserInclude) {
    await this.prismaService.user.create({
      data,
      include,
    });
  }
}
