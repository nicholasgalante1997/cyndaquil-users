import mysql from 'mysql';
import { MYSQLConfig } from '../types';
import { logger } from '../utils';

export class DatabaseManager {
  _config: MYSQLConfig;

  constructor(config: MYSQLConfig) {
    this._config = config;
  }

  connect(): mysql.Connection {
    return mysql.createConnection(this._config);
  }

  async query<T = any>(query: string, values?: string[]): Promise<T | null> {
    try {
      const connection = this.connect();
      if (values) {
        const queryResult: T = await new Promise(
          (resolve, reject) => {
            connection.query(query, values, (err, results, fields) => {
              if (err) {
                logger.error(err.message);
                connection.end();
                throw new Error(err.message);
              }
              resolve(results);
            });
          }
        );

        connection.end();
        return queryResult;
      }

      const queryResult: T = await new Promise((resolve, reject) => {
        connection.query(query, (err, results, fields) => {
          if (err) {
            logger.error(err.message);
            connection.end();
            throw new Error(err.message);
          }
          resolve(results);
        });
      });
      connection.end();
      return queryResult;
    } catch (e) {
      logger.error(e);
      return null;
    }
  }
}

export const dbService = new DatabaseManager({
  database: 'users',
  host: 'cyndaquil_mysql_db',
  user: 'root',
  password: 'examplepassword',
  port: 3306,
});
