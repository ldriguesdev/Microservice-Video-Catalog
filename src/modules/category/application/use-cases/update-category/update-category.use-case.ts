import { IUseCase } from "../../../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../../shared/domain/value-object/uuid.value-object";
import { Category } from "../../../domain/category.entity";
import { ICategoryRepository } from "../../../domain/category.repository";
import { CategoryOutputMapper, CategoryOutput } from "../common/category.output";


export class UpdateCategoryUseCase implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput> {
  constructor(private categoryRepository: ICategoryRepository) { }

  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const uuid = new Uuid(input.id);
    const category = await this.categoryRepository.findById(uuid);

    if (!category) {
      throw new NotFoundError(input.id, Category);
    }

    input.name && category.changeName(input.name);
    input.description !== undefined && category.changeDescription(input.description);
    input.is_active !== undefined && (input.is_active ? category.activate() : category.deactivate());

    await this.categoryRepository.update(category);

    return CategoryOutputMapper.toOutput(category);
  }
}

export type UpdateCategoryInput = {
  id: string;
  name?: string;
  description?: string;
  is_active?: boolean;
}

export type UpdateCategoryOutput = CategoryOutput
