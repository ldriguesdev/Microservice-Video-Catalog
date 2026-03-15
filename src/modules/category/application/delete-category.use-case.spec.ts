import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { InvalidUuidError, Uuid } from "../../../shared/domain/value-object/uuid.value-object";
import { CategoryDataBuilder } from "../domain/category-data-builder";
import { Category } from "../domain/category.entity";
import { CategoryInMemoryRepository } from "../infra/db/in-memory/category-in-memory.repository";
import { DeleteCategoryUseCase } from "./delete-caregory.use-case";

describe('DeleteCategoryUseCase', () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
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
    const category = CategoryDataBuilder.aCategory().withName('Movie').build();
    await repository.insert(category);
    await useCase.execute({ id: category.category_id.id });

    expect(repository.items).toHaveLength(0);
  })
})
