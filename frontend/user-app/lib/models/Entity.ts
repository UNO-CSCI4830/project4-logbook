export abstract class Entity<ID = number> {
  constructor(public id?: ID) {}

  /** Create a domain instance from raw JSON */
  static fromJSON<T>(this: new () => T, json: unknown): T {
    return Object.assign(new this(), json);
  }

  /** Validate current state  */
  validate(): string[] { return []; }

  /** Serialize to API payload  */
  toPayload(): Record<string, unknown> { return { ...this } as any; }
}
