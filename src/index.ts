import { server } from './server';
import {
  CREATE_USERS_DATABASE_IF_NOT_EXISTS_COMMAND,
  CREATE_USERS_TABLE_IF_NOT_EXISTS_COMMAND,
  CREATE_USER_CARDS_TABLE_IF_NOT_EXISTS_COMMAND,
  dbService,
  QUERY_DATABASES,
  QUERY_TABLES_IN_DATABASE,
} from './db';
import { logger } from './utils';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT ?? (8080 as const);

type DatabaseRowDataPacket = { Database: string };
type TableRowDataPacket = { Tables_in_users: string };

async function pollDatabaseConnection(): Promise<boolean> {
  /** Promisify mysql.Connection#connect() which is synchronous but takes a callback */
  return new Promise((resolve, reject) => {
    /** get an instance of mysql.Connection */
    const dbQuerier = dbService.connect();
    /** mysql.Connection accepts a callback */
    dbQuerier.connect((err) => {
      /** if we've errored on connection, reject and error */
      if (err) {
        reject(err);
      }
      /** resolve if weve established a connection */
      logger.info('connected to database!');
      resolve(true);
    })
  })
}

async function setupDatabase(){
  try {
    logger.info('Attempting to create db connection...');
    /** attempt to query mysql connection for available databases, should be an array of { Database: string; } */
    const databases = await dbService.query(QUERY_DATABASES);
    /** convert the query response to a typed shape */
    const databasesIterable = databases as unknown as DatabaseRowDataPacket[];
    /** if the query response is undefined or cant be coerced we likely have sustained an issue to our db connection */
    if (typeof databasesIterable === 'undefined') {
      logger.error('Databases iterable has been returned as undefined.');
      throw new Error('Could not cast database query to iterable.');
    }
    /** We've received a non null query result */
    logger.info('polling databases! result: ' + JSON.stringify(databasesIterable));
    /** If we have no databases in our mysql container */
    if (databasesIterable.length === 0) {
      try {
        /** create the database */
        const createDatabaseQueryResult = await dbService.query(CREATE_USERS_DATABASE_IF_NOT_EXISTS_COMMAND);
        if (!createDatabaseQueryResult) {
          throw new Error('Unable to create database with provided query. Check log output.');
        }
      } catch (e) {
        logger.error(e);
        throw e;
      }
    }
  } catch (e: any) {
    logger.error(e);
    throw e;
  }
}

async function ensureTableValidity() {
  try {
    const tables = await dbService.query(QUERY_TABLES_IN_DATABASE);
    const tablesIterable = tables as unknown as TableRowDataPacket[];
    if (typeof tablesIterable === 'undefined') {
      throw new Error('Could not cast tables query to iterable.');
    }
    logger.info({ tablesIterable });
    /** if no tables exist */
    if (tablesIterable.length === 0) {
      /** create users table */
      const createUsersTableQueryResult = await dbService.query(CREATE_USERS_TABLE_IF_NOT_EXISTS_COMMAND);
      if (!createUsersTableQueryResult) {
        throw new Error('Unable to create relation `users` with provided query. Check log output.');
      }
      /** create cards table */
      const createCardsTableQueryResult = await dbService.query(CREATE_USER_CARDS_TABLE_IF_NOT_EXISTS_COMMAND);
      if (!createCardsTableQueryResult) {
        throw new Error('Unable to create relation `cards` with provided query. Check log output.');
      }
    } else {
      for (const table of tablesIterable) {
        if (!['users', 'user_cards'].includes(table.Tables_in_users)) {
          throw new Error(
            'Missing table _ ' +
              table.Tables_in_users +
              ' from tables iterable.'
          );
        }
      }
    }
  } catch (e) {
    logger.error(e)
    throw e;
  } 
}

/** Establish Database Connection */
async function main() {
  logger.info('Beginning main fn invocation...');
  try {
      var connected = await pollDatabaseConnection();
      if (connected) {
        await setupDatabase();
        await ensureTableValidity();
        server.listen(port, () => {
          logger.info('listening...');
        });
      }
  } catch (e: any) {
    logger.error((e as Error).message);
    logger.error('DatabaseManager unable to connect. Terminal Op Failure. Server shutting down safely.');
  }
}

main();
