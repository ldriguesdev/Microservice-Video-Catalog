import { CollectionPresenter } from "./collection.presenter";

describe('CollectionPresenter Unit tests', () => {
  it('should be defined', () => {
    expect(CollectionPresenter).toBeDefined();
  });

  it('should create a CollectionPresenter instance with the correct properties', () => {
    const props = {
      current_page: 1,
      per_page: 10,
      last_page: 5,
      total: 50,
    };

    class TestCollectionPresenter extends CollectionPresenter {
      get data() {
        return [];
      }
    }

    const presenter = new TestCollectionPresenter(props);

    expect(presenter.meta.current_page).toBe(props.current_page);
    expect(presenter.meta.per_page).toBe(props.per_page);
    expect(presenter.meta.last_page).toBe(props.last_page);
    expect(presenter.meta.total).toBe(props.total);
  });
}); 
