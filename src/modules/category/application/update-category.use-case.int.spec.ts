import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../shared/domain/value-object/uuid.value-object";
import { setupSequelize } from "../../../shared/infra/testing/helpers";
import { Category } from "../domain/category.entity";
import { CategorySequelizeRepository } from "../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../infra/db/sequelize/category.model";
import { UpdateCategoryUseCase } from "./update-category.use-case";

describe('UpdateCategoryUseCase Integration Test', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategorySequelizeRepository

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase(repository);
  })

  it('should throw error when category not found', async () => {
    const uuid = new Uuid()
    await expect(() => useCase.execute({ id: uuid.id, name: 'Movie Updated' }))
      .rejects.toThrow(new NotFoundError(uuid.id, Category));
  })
  it('should update category when found', async () => {
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    let output = await useCase.execute({ id: entity.category_id.id, name: 'Movie Updated' });
    let updatedEntity = await repository.findById(entity.category_id);

    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'Movie Updated',
      description: entity.description,
      is_active: true,
      created_at: entity.created_at,
    })

    output = await useCase.execute({ id: entity.category_id.id, name: 'Movie Updated', description: 'some description', is_active: false });
    updatedEntity = await repository.findById(entity.category_id);

    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'Movie Updated',
      description: 'some description',
      is_active: false,
      created_at: entity.created_at,
    })

    output = await useCase.execute({ id: entity.category_id.id, name: 'Movie Updated', description: 'some description' });
    updatedEntity = await repository.findById(entity.category_id);

    expect(output).toStrictEqual({
      id: entity.category_id.id,
      description: 'some description',
      name: 'Movie Updated',
      is_active: false,
      created_at: entity.created_at,
    })
  })
})
