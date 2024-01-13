import { Module } from '@nestjs/common';
import { AuthModule } from './core/auth/auth.module';
import { UsersModule } from './core/users/users.module';
import { FollowershipsModule } from './core/followerships/followerships.module';
import { ConfigModule } from '@nestjs/config';
import { CloudinaryModule } from './lib/cloudinary/cloudinary.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    CloudinaryModule,
    FollowershipsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
