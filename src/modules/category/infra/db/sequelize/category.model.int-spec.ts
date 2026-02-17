import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "./category.model";
import { CategoryDataBuilder } from "../../../domain/category-data-builder";

describe("CategoryModel Integration Test with DataBuilder", () => {
  let sequelize: Sequelize;

  beforeAll(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      // logging: false,
    });

    sequelize.addModels([CategoryModel]);
    await sequelize.sync({ force: true });
  });

beforeEach(async () => {
  await sequelize.sync({ force: true });
});

  afterAll(async () => {
    await sequelize.close();
  });

  it("should persist a category built by DataBuilder", async () => {
    const category = CategoryDataBuilder.aCategory()
      .withName("Movies")
      .withDescription("Category for movies")
      .activate()
      .build();

    await CategoryModel.create({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });

    const model = await CategoryModel.findByPk(category.category_id.id);

    expect(model).not.toBeNull();
    expect(model!.category_id).toBe(category.category_id.id);
    expect(model!.name).toBe(category.name);
    expect(model!.description).toBe(category.description);
    expect(model!.is_active).toBe(category.is_active);
    expect(model!.created_at.getTime()).toBe(category.created_at.getTime());
  });

  it("should persist multiple categories built by DataBuilder", async () => {
    const categories = CategoryDataBuilder.theCategories(3).build();

    await CategoryModel.bulkCreate(
      categories.map((category) => ({
        category_id: category.category_id.id,
        name: category.name,
        description: category.description,
        is_active: category.is_active,
        created_at: category.created_at,
      })),
    );

    const models = await CategoryModel.findAll();

    expect(models.length).toBe(3);

    models.forEach((model, index) => {
      expect(model.category_id).toBe(categories[index].category_id.id);
      expect(model.name).toBe(categories[index].name);
      expect(model.description).toBe(categories[index].description);
      expect(model.is_active).toBe(categories[index].is_active);
    });
  });
});
