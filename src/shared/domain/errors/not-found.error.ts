import { Entity } from "../entity";

export class NotFoundError extends Error {
  constructor(id: any[] | any, entityCase: new (...args: any[]) => Entity) {
    const idsMessage = Array.isArray(id) ? id.join(', ') : id;
    super(`${entityCase.name} Not found using ID ${idsMessage}`);
    this.name = 'NotFoundError'
  }
}
