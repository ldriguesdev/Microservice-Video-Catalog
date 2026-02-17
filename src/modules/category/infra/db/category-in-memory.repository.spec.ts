import { CategoryInMemoryRepository } from "./category-in-memory.repository";
import { SearchParams } from "../../../../shared/domain/repository/search-params";
import { CategoryDataBuilder } from "../../domain/category-data-builder";
import { Category } from "../../domain/category.entity";

describe("CategoryInMemoryRepository", () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
  });

  describe("sortableFields", () => {
    it("should define sortable fields correctly", () => {
      expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);
    });
  });

  describe("getEntity", () => {
    it("should return Category entity", () => {
      expect(repository.getEntity()).toBe(Category);
    });
  });

  describe("applyFilter", () => {
    it("should return all items when filter is null", async () => {
      repository.items = CategoryDataBuilder.theCategories(2).build();

      const result = await repository.search(
        new SearchParams({ filter: null }),
      );

      expect(result.items.length).toBe(2);
    });

    it("should return all items when filter is empty string", async () => {
      repository.items = CategoryDataBuilder.theCategories(2).build();

      const result = await repository.search(new SearchParams({ filter: "" }));

      expect(result.items.length).toBe(2);
    });

    it("should filter items case insensitive", async () => {
      repository.items = CategoryDataBuilder.theCategories(3)
        .withName((index) => ["Filmes", "Séries", "Documentários"][index])
        .build();

      const result = await repository.search(
        new SearchParams({ filter: "fil" }),
      );

      expect(result.items).toHaveLength(1);
      expect(result.items[0].name).toBe("Filmes");
    });

    it("should return empty when no match found", async () => {
      repository.items = CategoryDataBuilder.theCategories(2)
        .withName((index) => ["Filmes", "Séries"][index])
        .build();

      const result = await repository.search(
        new SearchParams({ filter: "abc" }),
      );

      expect(result.items).toHaveLength(0);
    });
  });

  describe("applySort", () => {
    it("should sort by created_at desc by default when sort is null", async () => {
      repository.items = CategoryDataBuilder.theCategories(3)
        .withName((index) => ["A", "B", "C"][index])
        .withCreatedAt(
          (index) =>
            [new Date(2020, 1, 1), new Date(2022, 1, 1), new Date(2021, 1, 1)][
              index
            ],
        )
        .build();

      const result = await repository.search(new SearchParams({}));

      expect(result.items.map((i) => i.name)).toStrictEqual(["B", "C", "A"]);
    });

    it("should sort by name asc", async () => {
      repository.items = CategoryDataBuilder.theCategories(3)
        .withName((index) => ["B", "A", "C"][index])
        .build();

      const result = await repository.search(
        new SearchParams({
          sort: "name",
          sort_dir: "asc",
        }),
      );

      expect(result.items.map((i) => i.name)).toStrictEqual(["A", "B", "C"]);
    });

    it("should sort by name desc", async () => {
      repository.items = CategoryDataBuilder.theCategories(3)
        .withName((index) => ["B", "A", "C"][index])
        .build();

      const result = await repository.search(
        new SearchParams({
          sort: "name",
          sort_dir: "desc",
        }),
      );

      expect(result.items.map((i) => i.name)).toStrictEqual(["C", "B", "A"]);
    });

    it("should ignore sort when field is not sortable", async () => {
      repository.items = CategoryDataBuilder.theCategories(3)
        .withName((index) => ["B", "A", "C"][index])
        .build();

      const result = await repository.search(
        new SearchParams({
          sort: "description", 
          sort_dir: "asc",
        }),
      );

      expect(result.items.length).toBe(3);
    });
  });

  describe("pagination", () => {
    it("should paginate results correctly", async () => {
      repository.items = CategoryDataBuilder.theCategories(4)
        .withName((index) => ["A", "B", "C", "D"][index])
        .build();

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
      expect(result.last_page).toBe(2);
    });
  });
});
