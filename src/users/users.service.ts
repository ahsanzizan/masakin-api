import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { PaginatedResult, paginator } from 'src/prisma/paginator';
import { PrismaService } from 'src/prisma/prisma.service';

const paginate = paginator({ perPage: 10 });

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers(
    where?: Prisma.UserWhereInput,
    orderBy?: Prisma.UserOrderByWithRelationInput,
    page?: number,
  ): Promise<PaginatedResult<User>> {
    return paginate(this.prisma.user, { page }, { where, orderBy });
  }

  async findByUsername(username: string) {
    return await this.prisma.user.findUnique({ where: { username } });
  }

  async createUser(data: Prisma.UserCreateInput, include?: Prisma.UserInclude) {
    await this.prisma.user.create({
      data,
      include,
    });
  }
}
