import { Category } from "../category.entity";

describe('Category Entity', () => {
  test('should create a category with valid parameters', () => {
    const category = new Category({
      name: 'Movies',
    });
    expect(category.category_id).toBeUndefined();
    expect(category.name).toBe('Movies');
    expect(category.description).toBeNull();
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);
  });


  test('should create a category with all parameters', () => {
    const createdAt = new Date('2024-01-01');

    const category = new Category({
      category_id: '123',
      name: 'Books',
      description: 'All kinds of books',
      is_active: false,
      created_at: createdAt,
    });

    expect(category.category_id).toBe('123');
    expect(category.name).toBe('Books');
    expect(category.description).toBe('All kinds of books');
    expect(category.is_active).toBe(false);
    expect(category.created_at).toEqual(createdAt);
  })

  test('should change the name of the category', () => {
    const category = new Category({
      name: 'Music',
    });

    category.changeName('Audio');

    expect(category.name).toBe('Audio');
  })

  test('should change the description of the category', () => {
    const category = new Category({
      name: 'Games',
    });

    category.changeDescription('All kinds of games');

    expect(category.description).toBe('All kinds of games');
  })

  test('should activate the category', () => {
    const category = new Category({
      name: 'Sports',
      is_active: false,
    });

    category.activate();

    expect(category.is_active).toBe(true);
  })

  test('should deactivate the category', () => {
    const category = new Category({
      name: 'Travel',
      is_active: true,
    });

    category.deactivate();

    expect(category.is_active).toBe(false);
  })

  test('should convert category to JSON', () => {
    const category = new Category({
      category_id: '456',
      name: 'Food',
      description: 'All kinds of food',
      is_active: true,
      created_at: new Date('2024-02-01'),
    });

    const json = category.toJson();

    expect(json).toEqual({
      category_id: '456',
      name: 'Food',
      description: 'All kinds of food',
      is_active: true,
      created_at: new Date('2024-02-01').toISOString(),
    });
  })
})
