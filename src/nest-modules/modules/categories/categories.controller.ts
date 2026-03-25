import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, ParseUUIDPipe, HttpCode, Query } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CreateCategoryUseCase } from '@core/modules/category/application/use-cases/create-category/create-category.use-case';
import { UpdateCategoryUseCase } from '@core/modules/category/application/use-cases/update-category/update-category.use-case';
import { DeleteCategoryUseCase } from '@core/modules/category/application/use-cases/delete-category/delete-caregory.use-case';
import { GetCategoryUseCase } from '@core/modules/category/application/use-cases/get-category/get-category.use-case';
import { ListCategoriesUseCase } from '@core/modules/category/application/use-cases/list-categories/list-categories.use-case';
import { CategoryCollectionPresenter, CategoryPresenter } from './categories.presenter';
import { CategoryOutput } from '@core/modules/category/application/use-cases/common/category.output';
import { SearchCategoriesDto } from './dto/search-categories.dto';

@Controller('categories')
export class CategoriesController {
  @Inject(CreateCategoryUseCase)
  private createCategoryUseCase: CreateCategoryUseCase
  @Inject(UpdateCategoryUseCase)
  private updateCategoryUseCase: UpdateCategoryUseCase
  @Inject(DeleteCategoryUseCase)
  private deleteCategoryUseCase: DeleteCategoryUseCase
  @Inject(GetCategoryUseCase)
  private getCategoryUseCase: GetCategoryUseCase
  @Inject(ListCategoriesUseCase)
  private listCategoriesUseCase: ListCategoriesUseCase

  @Post()
  async create(@Body() input: CreateCategoryDto) {
    const output = await this.createCategoryUseCase.execute(input);
    return CategoriesController.serialize(output)
  }

  @Get()
  async search(@Query() params: SearchCategoriesDto) {
    const output = await this.listCategoriesUseCase.execute(params)
    return new CategoryCollectionPresenter(output)
  }

  @Get(':id')
  async findOne(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    const output = await this.getCategoryUseCase.execute({
      id
    })
    return CategoriesController.serialize(output)
  }

  @Patch(':id')
  async update(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string, @Body() input: UpdateCategoryDto) {
    const output = await this.updateCategoryUseCase.execute({
      ...input,
      id
    })
    return CategoriesController.serialize(output)
  }

  @HttpCode(204)
  @Delete(':id')
  remove(@Param('id', new ParseUUIDPipe({ errorHttpStatusCode: 422 })) id: string) {
    this.deleteCategoryUseCase.execute({
      id
    })
  }

  static serialize(output: CategoryOutput) {
    return new CategoryPresenter(output)
  }
}
