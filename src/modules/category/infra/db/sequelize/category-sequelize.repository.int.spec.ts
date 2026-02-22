import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "./category.model";
import { CategorySequelizeRepository } from "./category-sequelize.repository";
import { Category } from "../../../domain/category.entity";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../../shared/domain/value-object/uuid.value-object";
import { CategorySearchParams } from "../../../domain/category.repository";

describe("CategorySequelizeRepository Integration Test", () => {
  let sequelize: Sequelize;
  let repository: CategorySequelizeRepository;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      models: [CategoryModel],
      logging: false,
    });

    await sequelize.sync({ force: true });
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  beforeEach(async () => {
    await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    await sequelize.close();
  });

  test("should insert a new category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    const result = await CategoryModel.findByPk(category.category_id.id);

    expect(result).not.toBeNull();
    expect(result!.toJSON()).toMatchObject({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });

  test("should insert multiple categories (bulkInsert)", async () => {
    const categories = [
      Category.fake().aCategory().build(),
      Category.fake().aCategory().build(),
    ];
    await repository.bulkInsert(categories);

    const result = await CategoryModel.findAll();
    expect(result).toHaveLength(2);
    expect(result[0].category_id).toBe(categories[0].category_id.id);
    expect(result[1].category_id).toBe(categories[1].category_id.id);
  });

  test("should find a category by id", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    const result = await repository.findById(category.category_id);

    expect(result).toBeDefined();
    expect(result?.category_id.id).toBe(category.category_id.id);
    expect(result?.name).toBe(category.name);
  });

  test("should return all categories", async () => {
    const category1 = Category.fake().aCategory().build();
    const category2 = Category.fake().aCategory().build();
    await repository.bulkInsert([category1, category2]);

    const categories = await repository.findAll();
    expect(categories).toHaveLength(2);
    expect(categories.map((c) => c.category_id.id)).toEqual(
      expect.arrayContaining([
        category1.category_id.id,
        category2.category_id.id,
      ]),
    );
  });

  test("should return an empty array if there are no categories", async () => {
    const categories = await repository.findAll();
    expect(categories).toHaveLength(0);
  });

  test("should update a category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    category.changeName("Updated Name");
    category.changeDescription("Updated Description");
    category.deactivate();

    await repository.update(category);

    const result = await CategoryModel.findByPk(category.category_id.id);
    expect(result?.name).toBe("Updated Name");
    expect(result?.description).toBe("Updated Description");
    expect(result?.is_active).toBe(false);
  });

  test("should throw a NotFoundError when trying to update a non-existent category", async () => {
    const category = Category.fake().aCategory().build();

    await expect(repository.update(category)).rejects.toThrow(
      new NotFoundError(category.category_id.id, Category),
    );
  });

  test("should delete a category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    await repository.delete(category.category_id);

    const result = await CategoryModel.findByPk(category.category_id.id);
    expect(result).toBeNull();
  });

  test("should throw a NotFoundError when trying to delete a non-existent category", async () => {
    const nonExistentId = new Uuid();

    await expect(repository.delete(nonExistentId)).rejects.toThrow(
      new NotFoundError(nonExistentId.id, Category),
    );
  });

  describe("search method", () => {
    test("should apply default pagination and sort by created_at descending", async () => {
      const category1 = Category.fake()
        .aCategory()
        .withName("A")
        .withCreatedAt(new Date("2023-01-01"))
        .build();
      const category2 = Category.fake()
        .aCategory()
        .withName("B")
        .withCreatedAt(new Date("2023-01-02"))
        .build();
      await repository.bulkInsert([category1, category2]);

      const searchParams = new CategorySearchParams();
      const result = await repository.search(searchParams);

      expect(result.total).toBe(2);
      expect(result.current_page).toBe(1);
      expect(result.per_page).toBe(15);
      expect(result.items).toHaveLength(2);

      expect(result.items[0].category_id.id).toBe(category2.category_id.id);
      expect(result.items[1].category_id.id).toBe(category1.category_id.id);
    });

    test("should apply filter by name", async () => {
      const category1 = Category.fake().aCategory().withName("Action").build();
      const category2 = Category.fake().aCategory().withName("Horror").build();
      await repository.bulkInsert([category1, category2]);

      const searchParams = new CategorySearchParams({ filter: "Act" });
      const result = await repository.search(searchParams);

      expect(result.total).toBe(1);
      expect(result.items[0].name).toBe("Action");
    });

    test("should apply pagination", async () => {
      const categories = [
        Category.fake().aCategory().withName("A").build(),
        Category.fake().aCategory().withName("B").build(),
        Category.fake().aCategory().withName("C").build(),
      ];
      await repository.bulkInsert(categories);

      const searchParams = new CategorySearchParams({ page: 2, per_page: 2 });
      const result = await repository.search(searchParams);

      expect(result.total).toBe(3);
      expect(result.items).toHaveLength(1);
      expect(result.current_page).toBe(2);
    });

    test("should apply custom sorting", async () => {
      const category1 = Category.fake().aCategory().withName("Zebra").build();
      const category2 = Category.fake().aCategory().withName("Apple").build();
      await repository.bulkInsert([category1, category2]);

      const searchParams = new CategorySearchParams({
        sort: "name",
        sort_dir: "asc",
      });
      const result = await repository.search(searchParams);

      expect(result.items[0].name).toBe("Apple");
      expect(result.items[1].name).toBe("Zebra");
    });
  });
});
