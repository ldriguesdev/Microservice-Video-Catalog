import { Entity } from "../../../domain/entity";
import { Uuid } from "../../../domain/value-object/uuid.value-object";
import { InMemoryRepository } from "./in-memory.repository";

type StubEntityConstructor = {
  entity_id?: Uuid;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor(props: StubEntityConstructor) {
    super();
    this.entity_id = props.entity_id || new Uuid();
    ((this.name = props.name), (this.price = props.price));
  }

  toJSON() {
    return {
      entity_id: this.entity_id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}
describe("InMemoryRepository Unit Test", () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  describe("insert", () => {
    test("should insert a new entity", async () => {
      const entity = new StubEntity({
        entity_id: new Uuid(),
        name: "Test insert",
        price: 100,
      });

      await repository.insert(entity);

      expect(repository.items.length).toBe(1);
      expect(repository.items[0]).toBe(entity);
    });
  });

  describe("bulkInsert", () => {
    test("should bulk insert entities", async () => {
      const entities = [
        new StubEntity({
          name: "Entity 1",
          price: 10,
        }),
        new StubEntity({
          name: "Entity 2",
          price: 20,
        }),
      ];

      await repository.bulkInsert(entities);

      expect(repository.items.length).toBe(2);
      expect(repository.items).toEqual(entities);
    });
  });

  describe("findById", () => {
    test("should find an entity by id", async () => {
      const entity = new StubEntity({
        name: "Find me",
        price: 50,
      });

      await repository.insert(entity);

      const result = await repository.findById(entity.entity_id);

      expect(result).toBe(entity);
    });

    test("should return null when entity not found", async () => {
      const result = await repository.findById(new Uuid());

      expect(result).toBeNull();
    });
  });

  describe("update", () => {
    test("should update an entity", async () => {
      const entity = new StubEntity({
        name: "Old name",
        price: 100,
      });

      await repository.insert(entity);

      const updatedEntity = new StubEntity({
        entity_id: entity.entity_id,
        name: "Updated name",
        price: 200,
      });

      await repository.update(updatedEntity);

      expect(repository.items[0].name).toBe("Updated name");
      expect(repository.items[0].price).toBe(200);
    });
  });

  describe("delete", () => {
    test("should delete an entity", async () => {
      const entity = new StubEntity({
        name: "Delete me",
        price: 999,
      });

      await repository.insert(entity);

      await repository.delete(entity.entity_id);

      expect(repository.items.length).toBe(0);
    });
  });
});
