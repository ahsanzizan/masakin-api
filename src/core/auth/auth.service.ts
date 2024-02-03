import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';
import { UsersService } from 'src/core/users/users.service';
import { compareData, encryptData } from 'src/utils/encryption.utils';
import { AuthUser } from './auth.types';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(username: string, email: string, password: string) {
    const findWithUsername = await this.usersService.getUser({ username });
    if (findWithUsername)
      throw new ForbiddenException(
        `User with username ${username} already exists`,
      );

    const findWithEmail = await this.usersService.getUser({ email });
    if (findWithEmail)
      throw new ForbiddenException(`User with email ${email} already exists`);

    const data: Prisma.UserCreateInput = {
      username,
      email,
      password: await encryptData(password),
    };

    return await this.usersService.createUser(data);
  }

  async signIn(username: string, pass: string) {
    const findUser = await this.usersService.getUser({ username });
    if (!findUser)
      throw new NotFoundException(`User with username ${username} not found`);

    const correctPass = await compareData(pass, findUser.password);
    if (!correctPass) throw new UnauthorizedException('Password is incorrect');

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, id, bio, ...userInfo } = findUser;

    const payload: AuthUser = {
      sub: id,
      ...userInfo,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
      ...payload,
    };
  }
}
