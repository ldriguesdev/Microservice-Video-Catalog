import { PaginationPresenter } from "./pagination.presenter";

describe('PaginationPresenter Unit tests', () => {
  it('should be defined', () => {
    expect(PaginationPresenter).toBeDefined();
  });

  it('should create a PaginationPresenter instance with the correct properties', () => {
    const props = {
      current_page: 1,
      per_page: 10,
      last_page: 5,
      total: 50,
    };

    const presenter = new PaginationPresenter(props);

    expect(presenter.current_page).toBe(props.current_page);
    expect(presenter.per_page).toBe(props.per_page);
    expect(presenter.last_page).toBe(props.last_page);
    expect(presenter.total).toBe(props.total);
  });
});
