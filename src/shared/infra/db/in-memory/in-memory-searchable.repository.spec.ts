import { Entity } from "../../../domain/entity";
import { Uuid } from "../../../domain/value-object/uuid.value-object";
import { SearchParams } from "../../../domain/repository/search-params";
import { InMemorySearchableRepository } from "./in-memory-searchable.repository";

type StubEntityConstructor = {
  entity_id?: Uuid;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityConstructor) {
    super();
    this.entity_id = props.entity_id || new Uuid();
    this.name = props.name;
    this.price = props.price;
  }

  toJson() {
    return {
      entity_id: this.entity_id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubSearchableRepository extends InMemorySearchableRepository<
  StubEntity,
  Uuid,
  string
> {
  sortableFields = ["name", "price"];

  protected async applyFilter(
    items: StubEntity[],
    filter: string | null,
  ): Promise<StubEntity[]> {
    if (!filter) return items;

    return items.filter((item) =>
      item.name.toLowerCase().includes(filter.toLowerCase()),
    );
  }

  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe("InMemorySearchableRepository Unit Test", () => {
  let repository: StubSearchableRepository;

  beforeEach(() => {
    repository = new StubSearchableRepository();
  });

  const entities = [
    new StubEntity({ name: "Apple", price: 100 }),
    new StubEntity({ name: "Banana", price: 50 }),
    new StubEntity({ name: "Orange", price: 75 }),
    new StubEntity({ name: "Avocado", price: 120 }),
  ];

  beforeEach(async () => {
    await repository.bulkInsert(entities);
  });

  describe("applyFilter", () => {
    test("should filter by name", async () => {
      const result = await repository.search(
        new SearchParams({
          filter: "av",
          page: 1,
          per_page: 10,
        }),
      );

      expect(result.total).toBe(1);
      expect(result.items[0].name).toBe("Avocado");
    });

    test("should return all when filter is null", async () => {
      const result = await repository.search(
        new SearchParams({
          filter: null,
          page: 1,
          per_page: 10,
        }),
      );

      expect(result.total).toBe(4);
    });
  });

  describe("applySort", () => {
    test("should sort by price ascending", async () => {
      const result = await repository.search(
        new SearchParams({
          sort: "price",
          sort_dir: "asc",
          page: 1,
          per_page: 10,
        }),
      );

      expect(result.items[0].price).toBe(50);
      expect(result.items[3].price).toBe(120);
    });

    test("should sort by price descending", async () => {
      const result = await repository.search(
        new SearchParams({
          sort: "price",
          sort_dir: "desc",
          page: 1,
          per_page: 10,
        }),
      );

      expect(result.items[0].price).toBe(120);
      expect(result.items[3].price).toBe(50);
    });

    test("should ignore sort when field is not sortable", async () => {
      const result = await repository.search(
        new SearchParams({
          sort: "invalid_field",
          sort_dir: "asc",
          page: 1,
          per_page: 10,
        }),
      );

      expect(result.items).toEqual(entities);
    });
  });

  describe("applyPaginate", () => {
    test("should paginate results correctly", async () => {
      const result = await repository.search(
        new SearchParams({
          page: 2,
          per_page: 2,
        }),
      );

      expect(result.items.length).toBe(2);
      expect(result.current_page).toBe(2);
      expect(result.per_page).toBe(2);
      expect(result.total).toBe(4);
    });
  });

  describe("search integration", () => {
    test("should filter, sort and paginate together", async () => {
      const result = await repository.search(
        new SearchParams({
          filter: "a",
          sort: "price",
          sort_dir: "asc",
          page: 1,
          per_page: 2,
        }),
      );

      expect(result.items.length).toBe(2);
      expect(result.total).toBeGreaterThan(0);
    });
  });
});
