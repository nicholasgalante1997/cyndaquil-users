export type SQLCreateQueryResult<T = any> = { result: boolean; err?: string; data?: T };

export interface IModel<T> {
  _tableName: string;
  create(item: T): Promise<SQLCreateQueryResult>;
  update(id: string, item: T): Promise<T>;
  readById(id: string): Promise<T>;
  readAll(): Promise<T[]>;
  delete(id: string): Promise<T>;
}
