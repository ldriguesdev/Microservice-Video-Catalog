import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { EntityValidationError } from "../../domain/validators/validation.error";
import { FieldsErrors } from "../../domain/validators/validator-fields-interface";

class StubValidator extends ClassValidatorFields<any> {
  errors: FieldsErrors = {};

  validate(data: any): boolean {
    if (!data.name) {
      this.errors = {
        name: ["name should not be empty"],
      };
      return false;
    }
    return true;
  }
}

describe("containsErrorMessage custom matcher", () => {
  describe("when using function that throws", () => {
    test("should pass when EntityValidationError contains expected error", () => {
      const expectedError = {
        name: ["name is required"],
      };

      const throwingFunction = () => {
        throw new EntityValidationError(expectedError);
      };

      expect(throwingFunction).containsErrorMessage({
        name: ["name is required"],
      });
    });

    test("should fail when no error is thrown", () => {
      const fn = () => {};

      expect(() =>
        expect(fn).containsErrorMessage({
          name: ["error"],
        }),
      ).toThrow();
    });
  });

  describe("when using validator object", () => {
    test("should pass when validator has expected errors", () => {
      const validator = new StubValidator();

      expect({
        validator,
        data: { name: null },
      }).containsErrorMessage({
        name: ["name should not be empty"],
      });
    });

    test("should fail when validator returns valid", () => {
      const validator = new StubValidator();

      expect(() =>
        expect({
          validator,
          data: { name: "valid name" },
        }).containsErrorMessage({
          name: ["name should not be empty"],
        }),
      ).toThrow();
    });

    test("should fail when error message does not match", () => {
      const validator = new StubValidator();

      expect(() =>
        expect({
          validator,
          data: { name: null },
        }).containsErrorMessage({
          name: ["different error"],
        }),
      ).toThrow();
    });
  });
});
