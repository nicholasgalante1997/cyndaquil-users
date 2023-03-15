import mysql from 'mysql';
import { MYSQLConfig } from '../types';

export class DatabaseManager {
  _config: MYSQLConfig;

  constructor(config: MYSQLConfig) {
    this._config = config;
  }

  connect(): mysql.Connection {
    return mysql.createConnection(this._config);
  }

  async query(query: string, values?: string[]): Promise<mysql.Query> {
    const connection = this.connect();
    if (values) {
      const queryResult: mysql.Query = await new Promise((resolve, reject) => {
        connection.query(query, values, (err, results, fields) => {
          if (err) {
            console.log(err.message);
            connection.end();
            throw new Error(err.message);
          }
          resolve(results);
        });
      });

      connection.end();
      return queryResult;
    }

    const queryResult: mysql.Query = await new Promise((resolve, reject) => {
      connection.query(query, (err, results, fields) => {
        if (err) {
          console.log(err.message);
          connection.end();
          throw new Error(err.message);
        }
        resolve(results);
      });
    });
    connection.end();
    return queryResult;
  }
}

export const dbService = new DatabaseManager({
  database: process.env.MYSQL_DATABASE!,
  host: process.env.MYSQL_HOST!,
  user: process.env.MYSQL_USER!,
  password: process.env.MYSQL_PASSWORD!
})