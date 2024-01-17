import { Injectable } from '@nestjs/common';
import { Prisma, Recipe } from '@prisma/client';
import { paginator } from 'src/lib/prisma/paginator';
import { PrismaService } from 'src/lib/prisma/prisma.service';

const paginate = paginator({ perPage: 10 });

@Injectable()
export class RecipesService {
  constructor(private readonly prismaService: PrismaService) {}

  async getRecipes({
    where,
    orderBy,
    page,
    select,
  }: {
    where?: Prisma.RecipeWhereInput;
    orderBy?: Prisma.RecipeOrderByWithRelationInput;
    page?: number;
    select?: Prisma.RecipeSelect;
  }) {
    return await paginate<Recipe, Prisma.RecipeFindManyArgs>(
      this.prismaService.recipe,
      { page },
      { where, orderBy, select },
    );
  }

  async getRecipe(
    where: Prisma.RecipeWhereUniqueInput,
    select?: Prisma.RecipeSelect,
  ) {
    return await this.prismaService.recipe.findUnique({ where, select });
  }

  async createRecipe(data: Prisma.RecipeCreateInput) {
    return await this.prismaService.recipe.create({ data });
  }

  async updateRecipe(
    where: Prisma.RecipeWhereUniqueInput,
    data: Prisma.RecipeUpdateInput,
  ) {
    return await this.prismaService.recipe.update({ where, data });
  }

  async deleteRecipe(where: Prisma.RecipeWhereUniqueInput) {
    return await this.prismaService.recipe.delete({ where });
  }
}
