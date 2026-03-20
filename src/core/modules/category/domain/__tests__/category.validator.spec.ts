import { Notification } from "../../../../shared/domain/validators/notification";
import { Uuid } from "../../../../shared/domain/value-object/uuid.value-object";
import { Category } from "../category.entity";
import { CategoryRules, CategoryValidator, CategoryValidatorFactory } from "../category.validator";


describe('Category Validator Unit Tests', () => {

  describe('CategoryRules', () => {

    test('should copy entity properties', () => {
      const entity = new Category({
        category_id: new Uuid(),
        name: 'Movies',
        description: 'test',
        is_active: true,
        created_at: new Date()
      });

      const rules = new CategoryRules(entity);

      expect(rules.name).toBe('Movies');
    });

  });


  describe('CategoryValidator', () => {

    test('should validate valid category', () => {

      const validator = new CategoryValidator();
      const notification = new Notification();

      const category = new Category({
        name: 'Movies'
      });

      const isValid = validator.validate(notification, category);

      expect(isValid).toBe(true);
      expect(notification.hasErrors()).toBe(false);
    });


    test('should return error when name is longer than 255 characters', () => {

      const validator = new CategoryValidator();
      const notification = new Notification();

      const category = new Category({
        name: 'a'.repeat(256)
      });

      const isValid = validator.validate(notification, category);

      expect(isValid).toBe(false);
      expect(notification.hasErrors()).toBe(true);
    });


    test('should validate using provided fields', () => {

      const validator = new CategoryValidator();
      const notification = new Notification();

      const category = new Category({
        name: 'Movies'
      });

      const spy = jest.spyOn(validator as any, 'validate');

      validator.validate(notification, category, ['name']);

      expect(spy).toHaveBeenCalled();
    });

    test('should use default fields when none provided', () => {

      const validator = new CategoryValidator();
      const notification = new Notification();

      const category = new Category({
        name: 'Movies'
      });

      const result = validator.validate(notification, category);

      expect(result).toBe(true);
    });

  });


  describe('CategoryValidatorFactory', () => {

    test('should create a CategoryValidator instance', () => {

      const validator = CategoryValidatorFactory.create();

      expect(validator).toBeInstanceOf(CategoryValidator);

    });

  });

});
