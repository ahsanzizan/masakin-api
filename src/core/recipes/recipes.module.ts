import { Module } from '@nestjs/common';
import { CloudinaryModule } from 'src/lib/cloudinary/cloudinary.module';
import { PrismaModule } from 'src/lib/prisma/prisma.module';
import { LikesModule } from '../likes/likes.module';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';

@Module({
  imports: [PrismaModule, CloudinaryModule, LikesModule],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
