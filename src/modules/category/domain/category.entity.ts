import { Entity } from "../../../shared/domain/entity";
import { EntityValidationError } from "../../../shared/domain/validators/validation.error";
import { Uuid } from "../../../shared/domain/value-object/uuid.value-object";
import { ValueObject } from "../../../shared/domain/value-object/value-object";
import { CategoryValidatorFactory } from "./category.validator";

export type CategoryConstructorProps = {
  category_id?: Uuid;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
};

export type CategoryCreateCommand = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export class Category implements Entity {
  category_id: Uuid;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;

  constructor(props: CategoryConstructorProps) {
    this.category_id = props.category_id ?? new Uuid();
    this.name = props.name;
    this.description = props.description ?? null;
    this.is_active = props.is_active ?? true;
    this.created_at = props.created_at ?? new Date();
  }

  get entity_id(): ValueObject {
    return this.category_id;
  }

  static create(props: CategoryCreateCommand): Category {
    const category = new Category(props);

    Category.validate(category);

    return category;
  }

  changeName(name: string): void {
    this.name = name;
    Category.validate(this);
  }

  changeDescription(description: string | null): void {
    this.description = description;
    Category.validate(this);
  }

  activate(): void {
    this.is_active = true;
  }

  deactivate(): void {
    this.is_active = false;
  }

  static validate(entity: Category) {
    const validate = CategoryValidatorFactory.create();

    const isValid = validate.validate(entity);

    if (!isValid) {
      throw new EntityValidationError(validate.errors);
    }
  }

  toJson() {
    return {
      category_id: this.category_id.id,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at.toISOString(),
    };
  }
}
