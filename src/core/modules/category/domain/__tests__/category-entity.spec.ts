import { Uuid } from "../../../../shared/domain/value-object/uuid.value-object";
import { Category } from "../category.entity";
import { CategoryValidatorFactory } from "../category.validator";


describe('Category Entity Unit Tests', () => {

  describe('constructor', () => {

    test('should create category with default values', () => {
      const category = new Category({
        name: 'Movies'
      });

      expect(category.category_id).toBeInstanceOf(Uuid);
      expect(category.name).toBe('Movies');
      expect(category.description).toBeNull();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test('should create category with all values', () => {
      const uuid = new Uuid();
      const date = new Date();

      const category = new Category({
        category_id: uuid,
        name: 'Movies',
        description: 'Category description',
        is_active: false,
        created_at: date
      });

      expect(category.category_id).toBe(uuid);
      expect(category.name).toBe('Movies');
      expect(category.description).toBe('Category description');
      expect(category.is_active).toBe(false);
      expect(category.created_at).toBe(date);
    });

  });

  describe('create()', () => {

    test('should create category using factory method', () => {
      const spyValidate = jest.spyOn(Category.prototype as any, 'validate');

      const category = Category.create({
        name: 'Movies'
      });

      expect(category.name).toBe('Movies');
      expect(spyValidate).toHaveBeenCalledWith(['name']);
    });

  });

  describe('entity_id getter', () => {

    test('should return category_id', () => {
      const category = new Category({
        name: 'Movies'
      });

      expect(category.entity_id).toBe(category.category_id);
    });

  });

  describe('changeName()', () => {

    test('should change name', () => {
      const category = new Category({
        name: 'Movies'
      });

      const spyValidate = jest.spyOn(category, 'validate');

      category.changeName('Series');

      expect(category.name).toBe('Series');
      expect(spyValidate).toHaveBeenCalledWith(['name']);
    });

  });

  describe('changeDescription()', () => {

    test('should change description', () => {
      const category = new Category({
        name: 'Movies'
      });

      category.changeDescription('New description');

      expect(category.description).toBe('New description');
    });

    test('should set description to null', () => {
      const category = new Category({
        name: 'Movies',
        description: 'text'
      });

      category.changeDescription(null);

      expect(category.description).toBeNull();
    });

  });

  describe('activate()', () => {

    test('should activate category', () => {
      const category = new Category({
        name: 'Movies',
        is_active: false
      });

      category.activate();

      expect(category.is_active).toBe(true);
    });

  });

  describe('deactivate()', () => {

    test('should deactivate category', () => {
      const category = new Category({
        name: 'Movies'
      });

      category.deactivate();

      expect(category.is_active).toBe(false);
    });

  });

  describe('validate()', () => {

    test('should call CategoryValidator', () => {

      const validateMock = jest.fn().mockReturnValue(true);

      jest.spyOn(CategoryValidatorFactory, 'create').mockReturnValue({
        validate: validateMock
      } as any);

      const category = new Category({
        name: 'Movies'
      });

      category.validate(['name']);

      expect(validateMock).toHaveBeenCalled();
    });

  });

  describe('toJSON()', () => {

    test('should convert entity to json', () => {
      const date = new Date();
      const uuid = new Uuid();

      const category = new Category({
        category_id: uuid,
        name: 'Movies',
        description: 'Description',
        is_active: true,
        created_at: date
      });

      const json = category.toJSON();

      expect(json).toStrictEqual({
        category_id: uuid.id,
        name: 'Movies',
        description: 'Description',
        is_active: true,
        created_at: date.toISOString()
      });
    });

  });

  describe('fake()', () => {

    test('should return CategoryDataBuilder', () => {
      const builder = Category.fake();

      expect(builder).toBeDefined();
    });

  });

});
