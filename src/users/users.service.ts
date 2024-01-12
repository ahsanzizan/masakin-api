import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginator } from 'src/prisma/paginator';
import { PrismaService } from 'src/prisma/prisma.service';

const paginate = paginator({ perPage: 10 });

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers(
    where?: Prisma.UserWhereInput,
    orderBy?: Prisma.UserOrderByWithRelationInput,
    page?: number,
  ) {
    return paginate(this.prisma.user, { where, orderBy }, { page });
  }

  async findUserByUsername(username: string) {
    return await this.prisma.user.findUnique({ where: { username } });
  }

  async createUser(data: Prisma.UserCreateInput, include?: Prisma.UserInclude) {
    await this.prisma.user.create({
      data,
      include,
    });
  }
}
