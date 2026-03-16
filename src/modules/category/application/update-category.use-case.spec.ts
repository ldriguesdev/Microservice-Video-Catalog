import { Not } from "sequelize-typescript";
import { InvalidUuidError, Uuid } from "../../../shared/domain/value-object/uuid.value-object";
import { CategoryInMemoryRepository } from "../infra/db/in-memory/category-in-memory.repository";
import { UpdateCategoryUseCase } from "./update-category.use-case";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { Category } from "../domain/category.entity";

describe('UpdateCategoryUseCase Integration Test', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
  })

  it('should throw error when category not found', async () => {
    await expect(() => useCase.execute({ id: 'fake id', name: 'Movie Updated' }))
      .rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid()

    await expect(() => useCase.execute({ id: uuid.id, name: 'Movie Updated' }))
      .rejects.toThrow(new NotFoundError(uuid.id, Category));
  })
  it('should update a category', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const entity = Category.create({ name: 'Movie' });
    await repository.insert(entity);

    let output = await useCase.execute({ id: entity.category_id.id, name: 'Movie Updated' });
    let updatedEntity = await repository.findById(entity.category_id);

    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'Movie Updated',
      description: entity.description,
      is_active: true,
      created_at: entity.created_at,
    })

    output = await useCase.execute({ id: entity.category_id.id, name: 'Movie Updated', description: 'some description', is_active: false });
    updatedEntity = await repository.findById(entity.category_id);

    expect(spyUpdate).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'Movie Updated',
      description: 'some description',
      is_active: false,
      created_at: entity.created_at,
    })

    output = await useCase.execute({ id: entity.category_id.id, name: 'Movie Updated', description: 'some description' });
    updatedEntity = await repository.findById(entity.category_id);

    expect(spyUpdate).toHaveBeenCalledTimes(3);
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'Movie Updated',
      description: 'some description',
      is_active: false,
      created_at: entity.created_at,
    })

    output = await useCase.execute({ id: entity.category_id.id, name: 'Movie Updated', is_active: true });
    updatedEntity = await repository.findById(entity.category_id);

    expect(spyUpdate).toHaveBeenCalledTimes(4);
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'Movie Updated',
      description: 'some description',
      is_active: true,
      created_at: entity.created_at,
    })
  })
})  
