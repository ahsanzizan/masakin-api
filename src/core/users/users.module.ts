import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/lib/cloudinary/cloudinary.module';
import { PrismaModule } from 'src/lib/prisma/prisma.module';
import { LikesModule } from '../likes/likes.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [PrismaModule, CloudinaryModule, LikesModule],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
