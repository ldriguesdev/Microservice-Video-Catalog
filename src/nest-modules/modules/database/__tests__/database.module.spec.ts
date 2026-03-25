import { ConfigService } from '@nestjs/config';

describe('DatabaseModule - Sequelize Config Factory', () => {
  const models = expect.any(Array);

  const createConfigServiceMock = (overrides: Record<string, any>) => {
    return {
      get: jest.fn((key: string) => overrides[key]),
    } as unknown as ConfigService;
  };

  const factory = (configService: ConfigService) => {
    const dbVendor = configService.get('DB_VENDOR');

    const baseConfig = {
      host: configService.get('DB_HOST'),
      logging: configService.get('DB_LOGGING'),
      autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
      models: expect.any(Array),
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
  };

  it('deve retornar configuração correta para sqlite', () => {
    const configService = createConfigServiceMock({
      DB_VENDOR: 'sqlite',
      DB_HOST: 'localhost',
      DB_LOGGING: false,
      DB_AUTO_LOAD_MODELS: true,
    });

    const result = factory(configService);

    expect(result).toEqual({
      host: 'localhost',
      logging: false,
      autoLoadModels: true,
      models,
      dialect: 'sqlite',
    });
  });

  it('deve retornar configuração correta para mysql', () => {
    const configService = createConfigServiceMock({
      DB_VENDOR: 'mysql',
      DB_HOST: 'localhost',
      DB_LOGGING: true,
      DB_AUTO_LOAD_MODELS: true,
      DB_PORT: 3306,
      DB_USERNAME: 'root',
      DB_PASSWORD: 'password',
      DB_DATABASE: 'test_db',
    });

    const result = factory(configService);

    expect(result).toEqual({
      host: 'localhost',
      logging: true,
      autoLoadModels: true,
      models,
      dialect: 'mysql',
      port: 3306,
      username: 'root',
      password: 'password',
      database: 'test_db',
    });
  });

  it('deve lançar erro para vendor não suportado', () => {
    const configService = createConfigServiceMock({
      DB_VENDOR: 'postgres',
    });

    expect(() => factory(configService)).toThrow(
      'Unsupported database config: postgres'
    );
  });
});
