import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginator } from 'src/lib/prisma/paginator';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { UserWithoutPasswordType } from 'src/types/users.types';
import { UserWithoutPassword } from 'src/utils/selector.utils';

const paginate = paginator({ perPage: 10 });

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers({
    where,
    orderBy,
    page,
  }: {
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
    page?: number;
  }) {
    return await paginate<UserWithoutPasswordType, Prisma.UserFindManyArgs>(
      this.prismaService.user,
      { page },
      {
        where,
        orderBy,
        select: UserWithoutPassword,
      },
    );
  }

  async getUser(
    where: Prisma.UserWhereUniqueInput,
    select?: Prisma.UserSelect,
  ) {
    return await this.prismaService.user.findUnique({
      where,
      select,
    });
  }

  async createUser(data: Prisma.UserCreateInput) {
    return await this.prismaService.user.create({
      data,
    });
  }

  async updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ) {
    return await this.prismaService.user.update({ where, data });
  }

  async deleteUser(where: Prisma.UserWhereUniqueInput) {
    return await this.prismaService.user.delete({ where });
  }
}
