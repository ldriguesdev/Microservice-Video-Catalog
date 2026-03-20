import { ValueObject } from "../value-object/value-object";

class SingleStringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class FullNameValueObject extends ValueObject {
  constructor(
    readonly firstName: string,
    readonly lastName: string,
  ) {
    super();
  }
}

describe("ValueObject equals", () => {
  describe("SingleStringValueObject", () => {
    it("should return true when values are equal", () => {
      const originalValue = new SingleStringValueObject("test");
      const sameValue = new SingleStringValueObject("test");

      expect(originalValue.equals(sameValue)).toBe(true);
    });

    it("should return false when values are different", () => {
      const originalValue = new SingleStringValueObject("test");
      const differentValue = new SingleStringValueObject("other");

      expect(originalValue.equals(differentValue)).toBe(false);
    });
  });

  describe("FullNameValueObject", () => {
    it("should return true when all properties are equal", () => {
      const originalValue = new FullNameValueObject("Leonardo", "Rodrigues");
      const sameValue = new FullNameValueObject("Leonardo", "Rodrigues");

      expect(originalValue.equals(sameValue)).toBe(true);
    });

    it("should return false when firstName is different", () => {
      const originalValue = new FullNameValueObject("Leonardo", "Rodrigues");
      const differentValue = new FullNameValueObject("João", "Rodrigues");

      expect(originalValue.equals(differentValue)).toBe(false);
    });

    it("should return false when lastName is different", () => {
      const originalValue = new FullNameValueObject("Leonardo", "Rodrigues");
      const differentValue = new FullNameValueObject("Leonardo", "Silva");

      expect(originalValue.equals(differentValue)).toBe(false);
    });
  });
});
