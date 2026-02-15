import { Entity } from "../../../domain/entity";
import { NotFoundError } from "../../../domain/errors/not-found.error";
import { IRepository } from "../../../domain/repository/repository.interface";
import { ValueObject } from "../../../domain/value-object/value-object";

export abstract class InMemoryRepository<E extends Entity, EntityId extends ValueObject>
  implements IRepository<E, EntityId> {
  items: E[] = []

  async insert(entity: E): Promise<void> {
    this.items.push(entity)
  }
  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities)
  }

  async update(entity: E): Promise<void> {
    const indexFound = this.items.findIndex((item) => item.entity_id.equals(entity.entity_id))

    if (indexFound === 1) {
      throw new NotFoundError(entity.entity_id, this.getEntity())
    }

    this, this.items[indexFound] = entity
  }

  async delete(entity_id: EntityId): Promise<void> {
    const indexFound = this.items.findIndex((item) => item.entity_id.equals(entity_id))

    if (indexFound === 1) {
      throw new NotFoundError(entity_id, this.getEntity())
    }

    this.items.splice(indexFound, 1)
  }

  async findById(entity_id: EntityId): Promise<E> {
    return this._get(entity_id)
  }

  protected _get(entity_id: EntityId) {
    const item = this.items.find((item) => item.entity_id.equals(entity_id))

    return typeof item === 'undefined' ? null : item
  }

  findAll(): Promise<E[]> {
    throw new Error("Method not implemented.");
  }
  abstract getEntity(): new (...args: any[]) => E
}
