import { ApiClient } from './ApiClient';
type Ctor<T> = { new (): T; fromJSON(json: unknown): T };

export abstract class BaseService<T> {
  constructor(protected api: ApiClient, protected basePath: string, protected C: Ctor<T>) {}

   async list(): Promise<T[]> {
    const { data } = await this.api.http.get(this.basePath);
    return (data as unknown[]).map(d => this.C.fromJSON(d));
  }

  async get(id: number | string): Promise<T> {
    const { data } = await this.api.http.get(`${this.basePath}/${id}`);
    return this.C.fromJSON(data);
  }

  async create(entity: T & { validate?: () => string[]; toPayload?: () => any }): Promise<T> {
    const errs = entity.validate?.() ?? [];
    if (errs.length) throw new Error(errs.join(' '));
    const payload = entity.toPayload?.() ?? entity;
    const { data } = await this.api.http.post(this.basePath, payload);
    return this.C.fromJSON(data);
  }

  async update(id: number | string, patch: Partial<T> & { toPayload?: () => any }): Promise<T> {
    const payload = patch.toPayload?.() ?? patch;
    const { data } = await this.api.http.patch(`${this.basePath}/${id}`, payload);
    return this.C.fromJSON(data);
  }

  async delete(id: number | string): Promise<void> {
    await this.api.http.delete(`${this.basePath}/${id}`);
  }
}
