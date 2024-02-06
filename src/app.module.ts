import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './core/auth/auth.module';
import { FollowershipsModule } from './core/followerships/followerships.module';
import { UsersModule } from './core/users/users.module';
import { CloudinaryModule } from './lib/cloudinary/cloudinary.module';
import { RecipesModule } from './core/recipes/recipes.module';
import { LikesModule } from './core/likes/likes.module';

@Module({
  imports: [
    AuthModule,
    UsersModule,
    ConfigModule.forRoot({ envFilePath: '.env' }),
    CloudinaryModule,
    FollowershipsModule,
    RecipesModule,
    LikesModule,
  ],
  providers: [],
})
export class AppModule {}
