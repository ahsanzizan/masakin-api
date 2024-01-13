import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { compareData, encryptData } from 'src/utils/encryption.utils';
import { AuthUser } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(username: string, email: string, password: string) {
    const findUser = await this.usersService.getUser({ username });
    if (findUser) throw new ForbiddenException();

    const data: Prisma.UserCreateInput = {
      username,
      email,
      password: await encryptData(password),
    };

    return await this.usersService.createUser(data);
  }

  async signIn(username: string, pass: string) {
    const findUser = await this.usersService.getUser({ username });
    if (!findUser) throw new UnauthorizedException();

    const correctPass = await compareData(pass, findUser.password);
    if (!correctPass) throw new UnauthorizedException();

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, id, bio, ...userInfo } = findUser;

    const payload: AuthUser = {
      sub: findUser.id,
      ...userInfo,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
