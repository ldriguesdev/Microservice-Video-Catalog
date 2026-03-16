import { SearchResult } from "../domain/repository/search-result";

export type PaginationOutput<T> = {
  items: T[];
  total: number;
  current_page: number;
  per_page: number;
  last_page: number;
}

export class PaginationOutputMapper {
  static toOutput<T>(items: T[], props: Omit<SearchResult, 'items'>): PaginationOutput<T> {
    return {
      items,
      total: props.total,
      current_page: props.current_page,
      per_page: props.per_page,
      last_page: props.last_page,
    };
  }
}
