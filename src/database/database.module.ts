import { CategoryModel } from '@core/modules/category/infra/db/sequelize/category.model';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { CONFIG_SCHEMA_TYPE } from 'src/config/config.module';

const models = [
  CategoryModel,
];

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (configService: ConfigService<CONFIG_SCHEMA_TYPE>) => {
        const dbVendor = configService.get('DB_VENDOR');

        const baseConfig = {
          host: configService.get('DB_HOST'),
          logging: configService.get('DB_LOGGING'),
          autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
          models,
        };

        const configMap = {
          sqlite: {
            dialect: 'sqlite',
          },
          mysql: {
            dialect: 'mysql',
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
          },
        };

        const selectedConfig = configMap[dbVendor];

        if (!selectedConfig) {
          throw new Error(`Unsupported database config: ${dbVendor}`);
        }

        return {
          ...baseConfig,
          ...selectedConfig,
        };
      },
      inject: [ConfigService]
    })
  ]
})
export class DatabaseModule { }



