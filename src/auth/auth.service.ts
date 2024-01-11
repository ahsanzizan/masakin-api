import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { compareData, encryptData } from 'src/utils/encryption.utils';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signUp(username: string, email: string, password: string) {
    const findUser = await this.usersService.findUserByUsername(username);
    if (findUser) throw new ForbiddenException();

    const data: Prisma.UserCreateInput = {
      username,
      email,
      password: encryptData(password),
    };

    await this.usersService.createUser(data);
  }

  async signIn(username: string, pass: string) {
    const findUser = await this.usersService.findUserByUsername(username);
    if (!findUser || compareData(pass, findUser.password))
      throw new UnauthorizedException();

    const payload = { sub: findUser.id, username };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
