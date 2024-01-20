import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  UnauthorizedException,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiQuery } from '@nestjs/swagger';
import { Prisma, Recipe } from '@prisma/client';
import { CloudinaryService } from 'src/lib/cloudinary/cloudinary.service';
import { PaginatedResult } from 'src/lib/prisma/paginator';
import { FileSizeGuard } from 'src/utils/guards/fileSize.guard';
import { ResponseTemplate } from 'src/utils/interceptors/transform.interceptor';
import { UseAuth } from '../auth/auth.decorator';
import { AuthUser } from '../auth/auth.types';
import { CreateRecipeDto } from './dto/createRecipe.dto';
import { RecipesService } from './recipes.service';
import { UpdateRecipeDto } from './dto/updateRecipe.dto';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Get all recipes (paginated)', tags: ['recipes'] })
  @ApiQuery({ name: 'page', type: String, required: false })
  async getAllRecipes(
    @Query('page') page?: number,
  ): Promise<ResponseTemplate<PaginatedResult<Recipe>>> {
    return {
      message: 'Retrieved recipes successfully',
      result: await this.recipesService.getRecipes({
        page,
      }),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  @ApiOperation({ summary: 'Get a recipe by id', tags: ['recipes'] })
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

  @HttpCode(HttpStatus.CREATED)
  @Post()
  @ApiOperation({ summary: 'Create a new recipe', tags: ['recipes'] })
  @UseGuards(new FileSizeGuard(5 * 1024 * 1024))
  @UseInterceptors(FileInterceptor('image'))
  async createRecipe(
    @UseAuth() user: AuthUser,
    @Body() data: CreateRecipeDto,
    @UploadedFile() image: Express.Multer.File,
  ): Promise<ResponseTemplate<Recipe>> {
    const uploadImageToCloudinary = await this.cloudinaryService
      .uploadImage(image)
      .catch(() => {
        throw new BadRequestException('Invalid file type');
      });
    const imageUrl = uploadImageToCloudinary.url as string;

    const recipeData: Prisma.RecipeCreateInput = {
      author: { connect: { id: user.sub } },
      title: data.title,
      description: data.description ?? null,
      vegetarian: Boolean(data.vegetarian),
      vegan: Boolean(data.vegan),
      cookDuration: data.cookDuration,
      price: data.price,
      healthy: Boolean(data.healthy),
      sustainable: Boolean(data.sustainable),
      servings: data.servings,
      dairyFree: Boolean(data.dairyFree),
      glutenFree: Boolean(data.glutenFree),
      imageUrl,
      ingredients: JSON.stringify(data.ingredients),
    };

    return {
      message: 'Created recipe successfully',
      result: await this.recipesService.createRecipe(recipeData),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  @ApiOperation({ summary: 'Update a recipe', tags: ['recipes'] })
  @UseGuards(new FileSizeGuard(5 * 1024 * 1024))
  @UseInterceptors(FileInterceptor('image'))
  async updateRecipe(
    @UseAuth() user: AuthUser,
    @Body() data: UpdateRecipeDto,
    @Param('id') id: string,
    @UploadedFile() image?: Express.Multer.File,
  ): Promise<ResponseTemplate<Recipe>> {
    const findRecipe = await this.recipesService.getRecipe({ id });
    if (!findRecipe)
      throw new NotFoundException(`No recipe found with id: ${id}`);

    if (findRecipe.authorId !== user.sub)
      throw new UnauthorizedException(`You are not the author of this recipe`);

    const recipeData: Prisma.RecipeUpdateInput = {
      ...data,
      ingredients: JSON.stringify(data.ingredients),
    };

    if (image) {
      const uploadImageToCloudinary = await this.cloudinaryService
        .uploadImage(image)
        .catch(() => {
          throw new BadRequestException('Invalid file type');
        });
      const imageUrl = uploadImageToCloudinary.url as string;
      recipeData.imageUrl = imageUrl;
    }

    return {
      message: 'Created recipe successfully',
      result: await this.recipesService.updateRecipe({ id }, recipeData),
    };
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete recipe by id', tags: ['recipes'] })
  async deleteRecipeById(
    @Param('id') id: string,
    @UseAuth() user: AuthUser,
  ): Promise<ResponseTemplate<Recipe>> {
    const findRecipe = await this.recipesService.getRecipe({ id });
    if (!findRecipe)
      throw new NotFoundException(`No recipe found with id: ${id}`);

    if (findRecipe.authorId !== user.sub)
      throw new UnauthorizedException(`You are not the author of this recipe`);

    return {
      message: 'Deleted recipe successfully',
      result: await this.recipesService.deleteRecipe({ id }),
    };
  }
}
