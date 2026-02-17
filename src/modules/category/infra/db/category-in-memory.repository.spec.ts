import { CategoryInMemoryRepository } from "./category-in-memory.repository";
import { Category } from "../../domain/category.entity";
import { SearchParams } from "../../../../shared/domain/repository/search-params";

describe("CategoryInMemoryRepository", () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
  });

  const createCategory = (name: string, createdAt?: Date) => {
    return new Category({
      name,
      created_at: createdAt ?? new Date(),
    });
  };
  describe("sortableFields", () => {
    it("should define sortable fields correctly", () => {
      expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);
    });
  });
  describe("applyFilter", () => {
    it("should return all items when filter is null", async () => {
      const items = [createCategory("Filmes"), createCategory("Séries")];

      repository.items = items;

      const result = await repository.search(
        new SearchParams({ filter: null }),
      );

      expect(result.items.length).toBe(2);
    });

    it("should filter items case insensitive", async () => {
      const items = [
        createCategory("Filmes"),
        createCategory("Séries"),
        createCategory("Documentários"),
      ];

      repository.items = items;

      const result = await repository.search(
        new SearchParams({ filter: "fil" }),
      );

      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("Filmes");
    });

    it("should return empty when no match found", async () => {
      repository.items = [createCategory("Filmes"), createCategory("Séries")];

      const result = await repository.search(
        new SearchParams({ filter: "abc" }),
      );

      expect(result.items).toHaveLength(0);
    });
  });

  describe("applySort", () => {
    it("should sort by created_at desc by default", async () => {
      const items = [
        createCategory("A", new Date(2020, 1, 1)),
        createCategory("B", new Date(2022, 1, 1)),
        createCategory("C", new Date(2021, 1, 1)),
      ];

      repository.items = items;

      const result = await repository.search(new SearchParams({}));

      expect(result.items[0].name).toBe("B");
      expect(result.items[1].name).toBe("C");
      expect(result.items[2].name).toBe("A");
    });

    it("should sort by name asc", async () => {
      const items = [
        createCategory("B"),
        createCategory("A"),
        createCategory("C"),
      ];

      repository.items = items;

      const result = await repository.search(
        new SearchParams({
          sort: "name",
          sort_dir: "asc",
        }),
      );

      expect(result.items.map((i) => i.name)).toStrictEqual(["A", "B", "C"]);
    });

    it("should sort by name desc", async () => {
      const items = [
        createCategory("B"),
        createCategory("A"),
        createCategory("C"),
      ];

      repository.items = items;

      const result = await repository.search(
        new SearchParams({
          sort: "name",
          sort_dir: "desc",
        }),
      );

      expect(result.items.map((i) => i.name)).toStrictEqual(["C", "B", "A"]);
    });
  });

  describe("pagination", () => {
    it("should paginate results correctly", async () => {
      const items = [
        createCategory("A"),
        createCategory("B"),
        createCategory("C"),
        createCategory("D"),
      ];

      repository.items = items;

      const result = await repository.search(
        new SearchParams({
          page: 2,
          per_page: 2,
          sort: "name",
          sort_dir: "asc",
        }),
      );

      expect(result.items).toHaveLength(2);
      expect(result.items.map((i) => i.name)).toStrictEqual(["C", "D"]);
      expect(result.current_page).toBe(2);
      expect(result.per_page).toBe(2);
      expect(result.total).toBe(4);
    });
  });
});
