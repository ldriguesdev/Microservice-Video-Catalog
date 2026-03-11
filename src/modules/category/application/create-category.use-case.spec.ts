import { CategoryInMemoryRepository } from "../infra/db/in-memory/category-in-memory.repository";
import { CreateCategoryUseCase } from "./create-category.use-case";

describe('CreateCategoryUseCase', () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  })

  it('should create a category', async () => {
    const spyInsert = jest.spyOn(repository, 'insert');
    let output = await useCase.execute({ name: 'Movie' });

    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: output.id,
      name: 'Movie',
      description: null,
      is_active: true,
      created_at: output.created_at,
    });

    output = await useCase.execute({ name: 'Movie', description: 'some description', is_active: false });

    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: output.id,
      name: 'Movie',
      description: 'some description',
      is_active: false,
      created_at: output.created_at,
    });
  })
});
