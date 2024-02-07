import { Recipe, User } from '@prisma/client';

export type LikeWithRecipe = {
  id: string;
  createdAt: Date;
  userId: string;
  recipeId: string;
  recipe: Recipe;
};

export type LikeWithUser = {
  id: string;
  createdAt: Date;
  userId: string;
  recipeId: string;
  user: User;
};
