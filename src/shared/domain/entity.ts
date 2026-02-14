import { ValueObject } from "./value-object/value-object";

export abstract class Entity {
  abstract toJson(): any
  abstract get entity_id(): ValueObject
}
