import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

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
