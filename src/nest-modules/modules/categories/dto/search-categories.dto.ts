import { ListCategoryInput } from "@core/modules/category/application/use-cases/list-categories/list-categories.use-case";
import { CategoryFilter } from "@core/modules/category/domain/category.repository";
import { SortDirection } from "@core/shared/domain/repository/search-params";

export class SearchCategoriesDto implements ListCategoryInput {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection;
  filter?: string;
}
