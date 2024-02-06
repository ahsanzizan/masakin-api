import { Module } from '@nestjs/common';
import { PrismaModule } from 'src/lib/prisma/prisma.module';
import { RecipesController } from './recipes.controller';
import { RecipesService } from './recipes.service';
import { CloudinaryModule } from 'src/lib/cloudinary/cloudinary.module';
import { LikesService } from '../likes/likes.service';

@Module({
  imports: [PrismaModule, CloudinaryModule, LikesService],
  controllers: [RecipesController],
  providers: [RecipesService],
})
export class RecipesModule {}
