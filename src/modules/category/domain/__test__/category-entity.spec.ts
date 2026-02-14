import { Uuid } from "../../../../shared/domain/value-object/uuid.value-object";
import { Category } from "../category.entity";

describe('Category Entity', () => {
  test('should create a category with valid parameters', () => {
    const category = new Category({
      name: 'Movies',
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.name).toBe('Movies');
    expect(category.description).toBeNull();
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);
  });

  test('should create a category with all parameters', () => {
    const createdAt = new Date('2024-01-01');
    const uuid = new Uuid('123e4567-e89b-12d3-a456-426614174000');

    const category = new Category({
      category_id: uuid,
      name: 'Books',
      description: 'All kinds of books',
      is_active: false,
      created_at: createdAt,
    });

    expect(category.category_id).toBeInstanceOf(Uuid);
    expect(category.category_id.id).toBe(uuid.id);
    expect(category.name).toBe('Books');
    expect(category.description).toBe('All kinds of books');
    expect(category.is_active).toBe(false);
    expect(category.created_at).toEqual(createdAt);
  });

  test('should change the name of the category', () => {
    const category = new Category({
      name: 'Music',
    });

    category.changeName('Audio');

    expect(category.name).toBe('Audio');
  });

  test('should change the description of the category', () => {
    const category = new Category({
      name: 'Games',
    });

    category.changeDescription('All kinds of games');

    expect(category.description).toBe('All kinds of games');
  });

  test('should activate the category', () => {
    const category = new Category({
      name: 'Sports',
      is_active: false,
    });

    category.activate();

    expect(category.is_active).toBe(true);
  });

  test('should deactivate the category', () => {
    const category = new Category({
      name: 'Travel',
      is_active: true,
    });

    category.deactivate();

    expect(category.is_active).toBe(false);
  });

  test('should convert category to JSON', () => {
    const uuid = new Uuid('123e4567-e89b-12d3-a456-426614174001');
    const createdAt = new Date('2024-02-01');

    const category = new Category({
      category_id: uuid,
      name: 'Food',
      description: 'All kinds of food',
      is_active: true,
      created_at: createdAt,
    });

    const json = category.toJson();

    expect(json).toEqual({
      category_id: uuid.id,
      name: 'Food',
      description: 'All kinds of food',
      is_active: true,
      created_at: createdAt.toISOString(),
    });
  });

});
