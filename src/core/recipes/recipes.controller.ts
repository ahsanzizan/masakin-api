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
import { LikesWithRecipes } from 'src/types/likes.type';
import { FileSizeGuard } from 'src/utils/guards/fileSize.guard';
import { ResponseTemplate } from 'src/utils/interceptors/transform.interceptor';
import { UseAuth } from '../auth/auth.decorator';
import { AuthUser } from '../auth/auth.types';
import { LikesService } from '../likes/likes.service';
import { CreateRecipeDto } from './dto/createRecipe.dto';
import { UpdateRecipeDto } from './dto/updateRecipe.dto';
import { RecipesService } from './recipes.service';

@Controller('recipes')
export class RecipesController {
  constructor(
    private readonly recipesService: RecipesService,
    private readonly cloudinaryService: CloudinaryService,
    private readonly likesService: LikesService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Get()
  @ApiOperation({ summary: 'Get all recipes (paginated)', tags: ['recipes'] })
  @ApiQuery({ name: 'page', type: String, required: false })
  @ApiQuery({ name: 'search', type: String, required: false })
  async getAllRecipes(
    @Query('page') page?: number,
    @Query('search') search?: string,
  ): Promise<ResponseTemplate<PaginatedResult<Recipe>>> {
    return {
      message: 'Retrieved recipes successfully',
      result: await this.recipesService.getRecipes({
        page,
        search,
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

  @HttpCode(HttpStatus.OK)
  @Get(':id/likes')
  @ApiOperation({ summary: "Get a recipe's likes by id", tags: ['recipes'] })
  async getRecipeLikes(
    @Param('id') id: string,
    @Query('page') page?: number,
  ): Promise<ResponseTemplate<PaginatedResult<LikesWithRecipes>>> {
    const recipeLikes = await this.likesService.getRecipeLikes(id, page);

    return {
      message: "Retrieved recipe's likes successfully",
      result: recipeLikes,
    };
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('like/:id')
  @ApiOperation({ summary: 'Likes a user', tags: ['recipes'] })
  async likeRecipe(
    @Param('id') id: string,
    @UseAuth() user: AuthUser,
  ): Promise<ResponseTemplate<null>> {
    await this.likesService.like(id, user.sub);

    return { message: 'Liked a recipe successfully', result: null };
  }

  @HttpCode(HttpStatus.CREATED)
  @Delete('like/:id')
  @ApiOperation({ summary: 'Unlikes a user', tags: ['recipes'] })
  async unlikeRecipe(
    @Param('id') id: string,
    @UseAuth() user: AuthUser,
  ): Promise<ResponseTemplate<null>> {
    await this.likesService.unlike(id, user.sub);

    return { message: 'Unliked a recipe successfully', result: null };
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
    const imageUrl = uploadImageToCloudinary.secure_url as string;

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
      ingredients: data.ingredients
        ? JSON.stringify(data.ingredients)
        : undefined,
    };

    if (image) {
      const uploadImageToCloudinary = await this.cloudinaryService
        .uploadImage(image)
        .catch(() => {
          throw new BadRequestException('Invalid file type');
        });
      const imageUrl = uploadImageToCloudinary.secure_url as string;
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
