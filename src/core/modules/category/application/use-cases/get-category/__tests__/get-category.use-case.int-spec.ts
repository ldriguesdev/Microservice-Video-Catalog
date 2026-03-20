import { NotFoundError } from "../../../../../../shared/domain/errors/not-found.error";
import { InvalidUuidError } from "../../../../../../shared/domain/value-object/uuid.value-object";
import { setupSequelize } from "../../../../../../shared/infra/testing/helpers";
import { CategoryDataBuilder } from "../../../../domain/category-data-builder";
import { Category } from "../../../../domain/category.entity";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { GetCategoryUseCase } from "../get-category.use-case";
import { Uuid } from "../../../../../../shared/domain/value-object/uuid.value-object";



describe('GetCategoryUseCase Integration Test', () => {
  let useCase: GetCategoryUseCase
  let repository: CategorySequelizeRepository

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetCategoryUseCase(repository);
  })

  it('should throw error when category not found', async () => {
    const uuid = new Uuid()
    await expect(() => useCase.execute({ id: uuid.id }))
      .rejects.toThrow(new NotFoundError(uuid.id, Category));
  })

  it('should throw error when category id is invalid', async () => {
    await expect(() => useCase.execute({ id: 'fake-id' }))
      .rejects.toThrow(new InvalidUuidError())
  })
  it('should get category', async () => {
    const category = CategoryDataBuilder.aCategory().withName('Movie').build();
    await repository.insert(category);

    const output = await useCase.execute({ id: category.category_id.id });

    expect(output).toStrictEqual({
      id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    })
  })
})
