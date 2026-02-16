import { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import { EntityValidationError } from "../../domain/validators/validation.error";
import { FieldsErrors } from "../../domain/validators/validator-fields-interface";

type Expected =
  | {
      validator: ClassValidatorFields<any>;
      data: any;
    }
  | (() => any);

expect.extend({
  containsErrorMessage(expected: Expected, received: FieldsErrors) {
    if (typeof expected === "function") {
      try {
        expected();
        return {
          pass: false,
          message: () => "Expected validation error but none was thrown",
        };
      } catch (e) {
        const error = e as EntityValidationError;
        return assertContainsErrorMessage(error.error, received);
      }
    } else {
      const { validator, data } = expected;
      const validated = validator.validate(data);

      if (validated) {
        return {
          pass: false,
          message: () =>
            "Expected validation error but validator returned valid",
        };
      }

      return assertContainsErrorMessage(validator.errors, received);
    }
  },
});

function assertContainsErrorMessage(
  expected: FieldsErrors,
  received: FieldsErrors,
) {
  const isMatch = expect.objectContaining(received).asymmetricMatch(expected);

  return isMatch
    ? { pass: true, message: () => "" }
    : {
        pass: false,
        message: () =>
          `Expected validation errors to contain ${JSON.stringify(
            received,
          )}. Current: ${JSON.stringify(expected)}`,
      };
}
