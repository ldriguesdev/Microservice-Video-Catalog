import { Sequelize } from "sequelize-typescript";
import { Category } from "../../../domain/category.entity";
import { CategoryModel } from "./category.model";
import { CategoryModelMapper } from "./category-model-mapper";
import { Uuid } from "../../../../../shared/domain/value-object/uuid.value-object";
import { EntityValidationError } from "../../../../../shared/domain/validators/validation.error";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";

describe("CategoryModelMapper Integration Test", () => {
  setupSequelize({ models: [CategoryModel] });

  it("should throws error when model is invalid", () => {
    const model = CategoryModel.build({
      category_id: new Uuid().id,
    });

    try {
      CategoryModelMapper.toEntity(model);
    } catch (error) {
      expect(error).toBeInstanceOf(EntityValidationError);
      expect(error as EntityValidationError).toMatchObject({
        errors: [
          "name should not be empty",
          "name must be a string",
          "description should not be empty",
          "description must be a string",
          "is_active should not be empty",
          "is_active must be a boolean value",
        ],
      });
    }
  });

  it("should convert a Category entity to CategoryModel", () => {
    const entity = new Category({
      category_id: new Uuid(),
      name: "Movies",
      description: "Category for movies",
      is_active: true,
      created_at: new Date(),
    });

    const model = CategoryModelMapper.toModel(entity);

    expect(model.toJSON()).toStrictEqual({
      category_id: entity.category_id.id,
      name: "Movies",
      description: "Category for movies",
      is_active: true,
      created_at: entity.created_at,
    });
  });

  it("should convert a CategoryModel to Category entity", async () => {
    const created = await CategoryModel.create({
      category_id: new Uuid().id,
      name: "Series",
      description: "Category for series",
      is_active: true,
      created_at: new Date(),
    });

    const entity = CategoryModelMapper.toEntity(created);

    expect(entity.category_id.id).toBe(created.category_id);
    expect(entity.name).toBe(created.name);
    expect(entity.description).toBe(created.description);
    expect(entity.is_active).toBe(created.is_active);
    expect(entity.created_at).toStrictEqual(created.created_at);
  });
});
