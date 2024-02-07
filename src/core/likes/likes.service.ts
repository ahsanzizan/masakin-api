import { Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { paginator } from 'src/lib/prisma/paginator';
import { PrismaService } from 'src/lib/prisma/prisma.service';
import { LikeWithRecipe, LikeWithUser } from 'src/types/likes.type';
import { UserWithoutPassword } from 'src/utils/selector.utils';
import { validateEntityById } from 'src/utils/validators.utils';

const paginate = paginator({ perPage: 20 });

@Injectable()
export class LikesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getRecipeLikes(recipeId: string, page?: number) {
    return await paginate<LikeWithRecipe, Prisma.LikeFindManyArgs>(
      this.prismaService.like,
      { page },
      {
        where: { recipeId },
        include: { user: { select: UserWithoutPassword } },
      },
    );
  }

  async likedByUser(userId: string, page?: number) {
    return await paginate<LikeWithUser, Prisma.LikeFindManyArgs>(
      this.prismaService.like,
      { page },
      {
        where: { userId },
        include: { recipe: true },
      },
    );
  }

  // Likes a recipe
  async like(recipeId: string, userId: string) {
    if (!(await validateEntityById(recipeId, 'Recipe')))
      throw new NotFoundException(`No recipe found with id: ${recipeId}`);

    // Update likes count
    await this.prismaService.recipe.update({
      where: { id: recipeId },
      data: { likesCount: { increment: 1 } },
    });

    return await this.prismaService.like.create({ data: { recipeId, userId } });
  }

  // Unlikes a recipe
  async unlike(recipeId: string, userId: string) {
    if (!(await validateEntityById(recipeId, 'Recipe')))
      throw new NotFoundException(`No recipe found with id: ${recipeId}`);

    // Update likes count
    await this.prismaService.recipe.update({
      where: { id: recipeId },
      data: { likesCount: { decrement: 1 } },
    });

    return await this.prismaService.like.delete({
      where: {
        userId_recipeId: {
          recipeId,
          userId,
        },
      },
    });
  }
}
