import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { PrismaModule } from 'src/lib/prisma/prisma.module';
import { UsersController } from './users.controller';
import { CloudinaryModule } from 'src/lib/cloudinary/cloudinary.module';
import { LikesService } from '../likes/likes.service';

@Module({
  imports: [PrismaModule, CloudinaryModule, LikesService],
  providers: [UsersService],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
