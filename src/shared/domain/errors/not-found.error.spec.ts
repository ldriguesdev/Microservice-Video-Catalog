import { NotFoundError } from "./not-found.error";
import { Entity } from "../entity";

class StubEntity extends Entity {
  entity_id: any;

  constructor() {
    super();
    this.entity_id = "stub-id";
  }

  toJson() {
    return {
      entity_id: this.entity_id,
    };
  }
}
describe("NotFoundError Unit Test", () => {
  test("should be instance of Error", () => {
    const error = new NotFoundError("123", StubEntity);

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(NotFoundError);
  });

  test("should set correct error name", () => {
    const error = new NotFoundError("123", StubEntity);

    expect(error.name).toBe("NotFoundError");
  });

  test("should create correct message when id is single value", () => {
    const error = new NotFoundError("123", StubEntity);

    expect(error.message).toBe("StubEntity Not found using ID 123");
  });

  test("should create correct message when id is an array", () => {
    const error = new NotFoundError(["1", "2", "3"], StubEntity);

    expect(error.message).toBe("StubEntity Not found using ID 1, 2, 3");
  });

  test("should work with numeric id", () => {
    const error = new NotFoundError(999, StubEntity);

    expect(error.message).toBe("StubEntity Not found using ID 999");
  });
});
