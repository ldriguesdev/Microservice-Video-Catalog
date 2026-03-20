import { DataType, PrimaryKey, Sequelize } from "sequelize-typescript";
import { CategoryModel } from "./category.model";
import { CategoryDataBuilder } from "../../../domain/category-data-builder";
import { Config } from "../../../../../shared/infra/config";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe("CategoryModel Integration Test with DataBuilder", () => {
  setupSequelize({ models: [CategoryModel] });

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

  it("should map all model attributes correctly", () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(CategoryModel.getAttributes());

    const categoryIdAttribute = attributesMap.category_id;
    const categoryNameAttribute = attributesMap.name;
    const categoryDescriptionAttribute = attributesMap.description;
    const categoryIsActiveAttribute = attributesMap.is_active;
    const categoryCreatedAtAttribute = attributesMap.created_at;

    expect(attributes).toStrictEqual([
      "category_id",
      "name",
      "description",
      "is_active",
      "created_at",
    ]);

    expect(categoryIdAttribute).toMatchObject({
      field: "category_id",
      fieldName: "category_id",
      primaryKey: true,
      type: DataType.UUID(),
    });

    expect(categoryNameAttribute).toMatchObject({
      field: "name",
      fieldName: "name",
      allowNull: false,
      type: DataType.STRING(255),
    });

    expect(categoryDescriptionAttribute).toMatchObject({
      field: "description",
      fieldName: "description",
      allowNull: true,
      type: DataType.TEXT(),
    });

    expect(categoryIsActiveAttribute).toMatchObject({
      field: "is_active",
      fieldName: "is_active",
      allowNull: false,
      type: DataType.BOOLEAN(),
    });

    expect(categoryCreatedAtAttribute).toMatchObject({
      field: "created_at",
      fieldName: "created_at",
      allowNull: false,
      type: DataType.DATE(3),
    });
  });
});
