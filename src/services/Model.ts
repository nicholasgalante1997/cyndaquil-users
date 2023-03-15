export interface IModel<T> {
    _tableName: string;
    create(item: T): Promise<T>;
    update(id: string, item: T): Promise<T>;
    readById(id: string): Promise<T>;
    readAll(): Promise<T[]>;
    delete(id: string): Promise<T>;
}