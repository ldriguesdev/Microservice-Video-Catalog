import { Module } from '@nestjs/common';
import { CategoriesModule } from './nest-modules/modules/categories/categories.module';
import { DatabaseModule } from './nest-modules/modules/database/database.module';
import { ConfigModule } from './nest-modules/modules/config/config.module';
import { SharedModule } from './nest-modules/modules/shared/collection.presenter';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    CategoriesModule,
    SharedModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule { }
