import { SearchParams } from "./search-params";

describe("SearchParams Unit Tests", () => {
  describe("constructor", () => {
    test("should set default values", () => {
      const params = new SearchParams();

      expect(params.page).toBe(1);
      expect(params.per_page).toBe(15);
      expect(params.sort).toBeNull();
      expect(params.sort_dir).toBeNull();
      expect(params.filter).toBeNull();
    });
  });

  describe("page property", () => {
    test("should set page when valid number", () => {
      const params = new SearchParams({ page: 5 });
      expect(params.page).toBe(5);
    });

    test("should normalize invalid page values to 1", () => {
      const invalidValues = [0, -1, 1.5, NaN, "abc" as any];

      invalidValues.forEach((value) => {
        const params = new SearchParams({ page: value });
        expect(params.page).toBe(1);
      });
    });
  });

  describe("per_page property", () => {
    test("should set per_page when valid", () => {
      const params = new SearchParams({ per_page: 20 });
      expect(params.per_page).toBe(20);
    });

    test("should keep default when invalid", () => {
      const invalidValues = [0, -10, 1.5, NaN, "abc" as any];

      invalidValues.forEach((value) => {
        const params = new SearchParams({ per_page: value });
        expect(params.per_page).toBe(15);
      });
    });

    test("should keep default when value is true", () => {
      const params = new SearchParams({ per_page: true as any });
      expect(params.per_page).toBe(15);
    });
  });

  describe("sort property", () => {
    test("should set sort when valid string", () => {
      const params = new SearchParams({ sort: "name" });
      expect(params.sort).toBe("name");
    });

    test("should normalize empty values to null", () => {
      const invalidValues = [null, undefined, ""];

      invalidValues.forEach((value) => {
        const params = new SearchParams({ sort: value as any });
        expect(params.sort).toBeNull();
      });
    });
  });

  describe("sort_dir property", () => {
    test("should be null when sort is not provided", () => {
      const params = new SearchParams({ sort_dir: "desc" });
      expect(params.sort_dir).toBeNull();
    });

    test("should default to asc when invalid", () => {
      const params = new SearchParams({
        sort: "name",
        sort_dir: "invalid" as any,
      });

      expect(params.sort_dir).toBe("asc");
    });

    test("should accept asc and desc (case insensitive)", () => {
      const params1 = new SearchParams({
        sort: "name",
        sort_dir: "asc",
      });

      const params2 = new SearchParams({
        sort: "name",
        sort_dir: "DESC" as any,
      });

      expect(params1.sort_dir).toBe("asc");
      expect(params2.sort_dir).toBe("desc");
    });
  });

  describe("filter property", () => {
    test("should set filter when valid", () => {
      const params = new SearchParams({ filter: "test" });
      expect(params.filter).toBe("test");
    });

    test("should normalize empty values to null", () => {
      const invalidValues = [null, undefined, ""];

      invalidValues.forEach((value) => {
        const params = new SearchParams({ filter: value as any });
        expect(params.filter).toBeNull();
      });
    });

    test("should cast filter to string", () => {
      const params = new SearchParams<number>({ filter: 123 as any });
      expect(params.filter).toBe("123");
    });
  });
});
