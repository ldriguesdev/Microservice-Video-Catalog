import { Entity } from "../entity";
import { ValueObject } from "../value-object/value-object";
import { SearchResult } from "./search-result";

class StubValueObject extends ValueObject {
  constructor(public readonly value: string) {
    super();
  }
}

class StubEntity extends Entity {
  entity_id: ValueObject;

  constructor(id: string = "123") {
    super();
    this.entity_id = new StubValueObject(id);
  }

  toJSON() {
    return {
      id: (this.entity_id as StubValueObject).value,
      name: "stub",
    };
  }
}

describe("SearchResult Unit Tests", () => {
  const createEntities = (count: number) =>
    Array.from({ length: count }).map(
      (_, index) => new StubEntity(`${index + 1}`),
    );

  describe("constructor", () => {
    test("should create correctly", () => {
      const entities = createEntities(10);

      const result = new SearchResult({
        items: entities,
        total: 100,
        current_page: 1,
        per_page: 10,
      });

      expect(result.items).toHaveLength(10);
      expect(result.total).toBe(100);
      expect(result.current_page).toBe(1);
      expect(result.per_page).toBe(10);
      expect(result.last_page).toBe(10);
    });
  });

  describe("last_page calculation", () => {
    test.each([
      { total: 100, per_page: 10, expected: 10 },
      { total: 101, per_page: 10, expected: 11 },
      { total: 0, per_page: 10, expected: 0 },
      { total: 5, per_page: 10, expected: 1 },
    ])("total=$total per_page=$per_page", ({ total, per_page, expected }) => {
      const result = new SearchResult({
        items: [],
        total,
        current_page: 1,
        per_page,
      });

      expect(result.last_page).toBe(expected);
    });
  });

  describe("toJSON method", () => {
    test("should return raw entities when forceEntity = false", () => {
      const entities = createEntities(2);

      const result = new SearchResult({
        items: entities,
        total: 2,
        current_page: 1,
        per_page: 10,
      });

      const json = result.toJSON();

      expect(json).toEqual({
        items: entities,
        total: 2,
        current_page: 1,
        per_page: 10,
        last_page: 1,
      });
    });

    test("should call toJSON when forceEntity = true", () => {
      const entities = createEntities(2);

      const spy = jest.spyOn(entities[0], "toJSON");

      const result = new SearchResult({
        items: entities,
        total: 2,
        current_page: 1,
        per_page: 10,
      });

      const json = result.toJSON(true);

      expect(spy).toHaveBeenCalled();

      expect(json).toEqual({
        items: [
          { id: "1", name: "stub" },
          { id: "2", name: "stub" },
        ],
        total: 2,
        current_page: 1,
        per_page: 10,
        last_page: 1,
      });
    });
  });
});
