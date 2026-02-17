import { Category } from "./category.entity";
import {
  CategoryRules,
  CategoryValidator,
  CategoryValidatorFactory,
} from "./category.validator";

describe("CategoryValidator Unit Tests", () => {
  describe("CategoryRules", () => {
    it("should assign properties correctly from Category", () => {
      const category = new Category({
        name: "Test",
        description: "Desc",
        is_active: true,
      });

      const rules = new CategoryRules(category);

      expect(rules.name).toBe("Test");
      expect(rules.description).toBe("Desc");
      expect(rules.is_active).toBe(true);
    });
  });

  describe("CategoryValidator", () => {
    let validator: CategoryValidator;

    beforeEach(() => {
      validator = new CategoryValidator();
    });

    it("should validate a valid category", () => {
      const category = new Category({
        name: "Valid Name",
        description: "Valid Description",
        is_active: true,
      });

      const isValid = validator.validate(category);

      expect(isValid).toBe(true);
      expect(validator.errors).toBeNull();
    });

    it("should invalidate when name is empty", () => {
      const category = new Category({
        name: "" as any,
        description: "Desc",
        is_active: true,
      });

      const isValid = validator.validate(category);

      expect(isValid).toBe(false);
      expect(validator.errors).toHaveProperty("name");
    });

    it("should invalidate when name is longer than 255 characters", () => {
      const category = new Category({
        name: "a".repeat(256),
        description: "Desc",
        is_active: true,
      });

      const isValid = validator.validate(category);

      expect(isValid).toBe(false);
      expect(validator.errors.name).toContain(
        "name must be shorter than or equal to 255 characters",
      );
    });

    it("should invalidate when name is not a string", () => {
      const category = new Category({
        name: 123 as any,
        description: "Desc",
        is_active: true,
      });

      const isValid = validator.validate(category);

      expect(isValid).toBe(false);
      expect(validator.errors).toHaveProperty("name");
    });

    it("should invalidate when description is not a string", () => {
      const category = new Category({
        name: "Valid",
        description: 123 as any,
        is_active: true,
      });

      const isValid = validator.validate(category);

      expect(isValid).toBe(false);
      expect(validator.errors).toHaveProperty("description");
    });

    it("should allow description to be null", () => {
      const category = new Category({
        name: "Valid",
        description: null,
        is_active: true,
      });

      const isValid = validator.validate(category);

      expect(isValid).toBe(true);
    });

    it("should invalidate when is_active is not boolean", () => {
      const category = new Category({
        name: "Valid",
        description: "Desc",
        is_active: "true" as any,
      });

      const isValid = validator.validate(category);

      expect(isValid).toBe(false);
      expect(validator.errors).toHaveProperty("is_active");
    });
  });

  describe("CategoryValidatorFactory", () => {
    it("should create a CategoryValidator instance", () => {
      const validator = CategoryValidatorFactory.create();

      expect(validator).toBeInstanceOf(CategoryValidator);
    });
  });
});
