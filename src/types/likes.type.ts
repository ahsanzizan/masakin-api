import { Recipe, User } from '@prisma/client';

export type LikesWithRecipes = {
  id: string;
  createdAt: Date;
  userId: string;
  recipeId: string;
  recipe: Recipe;
};

export type LikesWithUsers = {
  id: string;
  createdAt: Date;
  userId: string;
  recipeId: string;
  user: User;
};
