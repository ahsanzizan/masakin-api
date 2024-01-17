import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';
import { Recipe } from '@prisma/client';
import { PaginatedResult } from 'src/lib/prisma/paginator';
import {
  ResponseTemplate,
  TransformInterceptor,
} from 'src/utils/interceptors/transform.interceptor';
import { validateEntityById } from 'src/utils/validators.utils';
import { RecipesService } from './recipes.service';
import { AllowAnon } from '../auth/auth.decorator';

@Controller('recipes')
export class RecipesController {
  constructor(private readonly recipesService: RecipesService) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Get recipes' })
  @UseInterceptors(TransformInterceptor)
  async getAllRecipes(
    @Query('page') page?: number,
  ): Promise<ResponseTemplate<PaginatedResult<Recipe>>> {
    return {
      message: 'Retrieved users successfully',
      result: await this.recipesService.getRecipes({
        page,
      }),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Get recipe by id' })
  @UseInterceptors(TransformInterceptor)
  async getRecipeById(
    @Param('id') id: string,
  ): Promise<ResponseTemplate<Recipe>> {
    const recipe = await this.recipesService.getRecipe({ id });
    if (!recipe) throw new NotFoundException(`No recipe found with id: ${id}`);

    return {
      message: 'Retrieved recipe successfully',
      result: recipe,
    };
  }

  @AllowAnon()
  @Get('t/:id')
  async tes(@Param('id') id: string) {
    return await validateEntityById(id, 'Recipe');
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete recipe by id' })
  @UseInterceptors(TransformInterceptor)
  async deleteRecipeById(
    @Param('id') id: string,
  ): Promise<ResponseTemplate<Recipe>> {
    if (!(await validateEntityById(id, 'Recipe')))
      throw new NotFoundException(`No recipe with id: ${id}`);

    return {
      message: 'Retrieved recipe successfully',
      result: await this.recipesService.deleteRecipe({ id }),
    };
  }
}
