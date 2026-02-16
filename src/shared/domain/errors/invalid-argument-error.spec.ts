import { InvalidArgumentError } from "./invalid-argument.error";
describe("InvalidArgumentError Unit Tests", () => {
  it("should extend Error", () => {
    const error = new InvalidArgumentError("any message");

    expect(error).toBeInstanceOf(Error);
  });

  it("should have correct name", () => {
    const error = new InvalidArgumentError("any message");

    expect(error.name).toBe("InvalidArgumentError");
  });

  it("should set the correct message", () => {
    const message = "Invalid id provided";
    const error = new InvalidArgumentError(message);

    expect(error.message).toBe(message);
  });

  it("should preserve stack trace", () => {
    const error = new InvalidArgumentError("error message");

    expect(error.stack).toBeDefined();
  });
});
