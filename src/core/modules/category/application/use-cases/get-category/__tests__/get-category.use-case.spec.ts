import { NotFoundError } from "../../../../../../shared/domain/errors/not-found.error";
import { InvalidUuidError, Uuid } from "../../../../../../shared/domain/value-object/uuid.value-object";
import { CategoryDataBuilder } from "../../../../domain/category-data-builder";
import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/db/in-memory/category-in-memory.repository";
import { GetCategoryUseCase } from "../get-category.use-case";


describe('GetCategoryUseCase Test Unit', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
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
