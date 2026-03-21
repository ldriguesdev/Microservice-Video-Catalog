import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { CategoryModel } from '@core/modules/category/infra/db/sequelize/category.model';
import { CategorySequelizeRepository } from '@core/modules/category/infra/db/sequelize/category-sequelize.repository';
import { get } from 'http';

@Module({
  imports: [
    SequelizeModule.forFeature([CategoryModel])
  ],
  controllers: [CategoriesController],
  providers:[
    {
      provide: CategorySequelizeRepository,
      useFactory: (categoryModel: typeof CategoryModel) => new CategorySequelizeRepository(categoryModel),
      inject: [getModelToken(CategoryModel)],
    }
  ]
})
export class CategoriesModule { }
