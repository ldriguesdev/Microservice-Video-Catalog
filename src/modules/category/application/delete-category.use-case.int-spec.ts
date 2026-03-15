import { NotFoundError } from "../../../shared/domain/errors/not-found.error"
import { InvalidUuidError, Uuid } from "../../../shared/domain/value-object/uuid.value-object"
import { setupSequelize } from "../../../shared/infra/testing/helpers"
import { Category } from "../domain/category.entity"
import { CategorySequelizeRepository } from "../infra/db/sequelize/category-sequelize.repository"
import { CategoryModel } from "../infra/db/sequelize/category.model"
import { DeleteCategoryUseCase } from "./delete-caregory.use-case"

describe('DeleteCategoryUseCase Integration Test', () => {
  let useCase: DeleteCategoryUseCase
  let repository: CategorySequelizeRepository

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase(repository);
  })

  it('should throw error when category not found', async () => {
    const uuid = new Uuid()
    await expect(() => useCase.execute({ id: uuid.id }))
      .rejects.toThrow(new NotFoundError(uuid.id, Category));
  })

  it('should throw error when entity not found', async () => {
    await expect(() => useCase.execute({ id: 'fake-id' }))
      .rejects.toThrow(new InvalidUuidError());
  })

  it('should delete category when found', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);
    await useCase.execute({ id: category.category_id.id });

    const foundCategory = await repository.findById(category.category_id);
    expect(foundCategory).toBeNull();
  })
})
