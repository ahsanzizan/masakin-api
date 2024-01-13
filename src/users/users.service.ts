import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PaginatedResult, paginator } from 'src/prisma/paginator';
import { PrismaService } from 'src/prisma/prisma.service';

const paginate = paginator({ perPage: 10 });

@Injectable()
export class UsersService {
  constructor(private readonly prismaService: PrismaService) {}

  async getUsers(
    where?: Prisma.UserWhereInput,
    orderBy?: Prisma.UserOrderByWithRelationInput,
    page?: number,
  ): Promise<PaginatedResult<User>> {
    return paginate(this.prismaService.user, { page }, { where, orderBy });
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
