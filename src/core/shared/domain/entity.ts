import { Notification } from './validators/notification';
import { ValueObject } from './value-object/value-object';

export abstract class Entity {
  toJSON(): any {
    throw new Error('Method not implemented.');
  }
  notification: Notification = new Notification();

  abstract get entity_id(): ValueObject;
  // abstract toJSON(): any;
}
