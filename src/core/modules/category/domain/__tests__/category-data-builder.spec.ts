import { Uuid } from "../../../../shared/domain/value-object/uuid.value-object";
import { CategoryDataBuilder } from "../category-data-builder";
import { Category } from "../category.entity";


describe("CategoryDataBuilder Unit Tests", () => {
  describe("aCategory()", () => {
    it("should create a single Category instance", () => {
      const category = CategoryDataBuilder.aCategory().build();

      expect(category).toBeInstanceOf(Category);
    });

    it("should override name", () => {
      const category = CategoryDataBuilder.aCategory()
        .withName("Custom Name")
        .build();

      expect(category.name).toBe("Custom Name");
    });

    it("should override description", () => {
      const category = CategoryDataBuilder.aCategory()
        .withDescription("Custom Description")
        .build();

      expect(category.description).toBe("Custom Description");
    });

    it("should activate category", () => {
      const category = CategoryDataBuilder.aCategory().activate().build();

      expect(category.is_active).toBe(true);
    });

    it("should deactivate category", () => {
      const category = CategoryDataBuilder.aCategory().deactivate().build();

      expect(category.is_active).toBe(false);
    });

    it("should set category_id", () => {
      const id = new Uuid();

      const category = CategoryDataBuilder.aCategory()
        .withCategoryId(id)
        .build();

      expect(category.category_id).toBe(id);
    });

    it("should set created_at", () => {
      const date = new Date(2020, 1, 1);

      const category = CategoryDataBuilder.aCategory()
        .withCreatedAt(date)
        .build();

      expect(category.created_at).toEqual(date);
    });
  });

  describe("theCategories()", () => {
    it("should create multiple categories", () => {
      const categories = CategoryDataBuilder.theCategories(3).build();

      expect(Array.isArray(categories)).toBe(true);
      expect(categories).toHaveLength(3);
      categories.forEach((category) =>
        expect(category).toBeInstanceOf(Category),
      );
    });

    it("should use index inside factory", () => {
      const categories = CategoryDataBuilder.theCategories(3)
        .withName((index) => `Category ${index}`)
        .build();

      expect(categories[0].name).toBe("Category 0");
      expect(categories[1].name).toBe("Category 1");
      expect(categories[2].name).toBe("Category 2");
    });

    it("should use index for created_at factory", () => {
      const categories = CategoryDataBuilder.theCategories(2)
        .withCreatedAt((index) => new Date(2020, index, 1))
        .build();

      expect(categories[0].created_at).toEqual(new Date(2020, 0, 1));
      expect(categories[1].created_at).toEqual(new Date(2020, 1, 1));
    });
  });

  describe("withInvalidNameTooLong()", () => {
    it("should create a name longer than 255 characters", () => {
      const category = CategoryDataBuilder.aCategory()
        .withInvalidNameTooLong()
        .build();

      expect(category.name.length).toBeGreaterThan(255);
    });

    it("should use provided invalid name", () => {
      const invalid = "a".repeat(300);

      const category = CategoryDataBuilder.aCategory()
        .withInvalidNameTooLong(invalid)
        .build();

      expect(category.name).toBe(invalid);
    });
  });

  describe("getters", () => {
    it("should return configured name", () => {
      const builder = CategoryDataBuilder.aCategory().withName("Getter Test");

      expect(builder.name).toBe("Getter Test");
    });

    it("should return configured description", () => {
      const builder =
        CategoryDataBuilder.aCategory().withDescription("Desc Test");

      expect(builder.description).toBe("Desc Test");
    });

    it("should return configured is_active", () => {
      const builder = CategoryDataBuilder.aCategory().deactivate();

      expect(builder.is_active).toBe(false);
    });

    it("should throw when accessing category_id without factory", () => {
      const builder = CategoryDataBuilder.aCategory();

      expect(() => builder.category_id).toThrow(
        "Property category_id not have a factory, use 'with' methods",
      );
    });

    it("should throw when accessing created_at without factory", () => {
      const builder = CategoryDataBuilder.aCategory();

      expect(() => builder.created_at).toThrow(
        "Property created_at not have a factory, use 'with' methods",
      );
    });
  });

  describe("build return type behavior", () => {
    it("should return single object when count = 1", () => {
      const result = CategoryDataBuilder.aCategory().build();
      expect(result).toBeInstanceOf(Category);
    });

    it("should return array when count > 1", () => {
      const result = CategoryDataBuilder.theCategories(2).build();
      expect(Array.isArray(result)).toBe(true);
    });
  });
});
