import { PaginationOutput, PaginationOutputMapper } from "../../../shared/application/pagination-output"
import { IUseCase } from "../../../shared/application/use-case.interface";
import { SortDirection } from "../../../shared/domain/repository/search-params";
import { CategoryFilter, CategorySearchParams, CategorySearchResult, ICategoryRepository } from "../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./common/category.output"

export class ListCategoryUseCase implements IUseCase<ListCategoryInput, ListCategoryOutput> {
  constructor(private categoryRepository: ICategoryRepository) { }

  async execute(input: ListCategoryInput): Promise<ListCategoryOutput> {
    const params = new CategorySearchParams(input)
    const searchResult = await this.categoryRepository.search(params)

    return this.toOutput(searchResult)
  }


  private toOutput(searchResult: CategorySearchResult): ListCategoryOutput {
    const { items: _items } = searchResult
    const items = _items.map(item => CategoryOutputMapper.toOutput(item))

    return PaginationOutputMapper.toOutput(items, searchResult)
  }
}

export type ListCategoryInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: CategoryFilter | null;
}

export type ListCategoryOutput = PaginationOutput<CategoryOutput>
