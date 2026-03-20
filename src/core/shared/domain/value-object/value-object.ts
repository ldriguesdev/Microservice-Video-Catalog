import isEqual from "lodash/isEqual";

export abstract class ValueObject {
  public equals(value: this): boolean {
    if (value === null || value === undefined) {
      return false;
    }

    if (value.constructor.name !== this.constructor.name) {
      return false;
    }

    return isEqual(value, this);
  }
}
