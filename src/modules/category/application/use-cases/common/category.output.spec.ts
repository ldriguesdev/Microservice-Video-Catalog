import { Category } from "../../../domain/category.entity";
import { CategoryOutputMapper } from "./category.output";

describe('CategoryOutputMapper', () => {
  it('should map a category entity to its output representation', () => {
    const categoryEntity = {
      category_id: { id: '123' },
      name: 'Test Category',
      description: 'A category for testing',
      is_active: true,
      created_at: new Date('2024-01-01T00:00:00Z'),
    };

    const expectedOutput = {
      id: '123',
      name: 'Test Category',
      description: 'A category for testing',
      is_active: true,
      created_at: new Date('2024-01-01T00:00:00Z'),
    };

    const output = CategoryOutputMapper.toOutput(categoryEntity as Category);
    expect(output).toEqual(expectedOutput);
  });
});
