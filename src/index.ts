import { server } from './server';
import { CREATE_USERS_DATABASE_IF_NOT_EXISTS_COMMAND, CREATE_USERS_TABLE_IF_NOT_EXISTS_COMMAND, CREATE_USER_CARDS_TABLE_IF_NOT_EXISTS_COMMAND, dbService, QUERY_DATABASES, QUERY_TABLES_IN_DATABASE } from './db';
import dotenv from 'dotenv';

dotenv.config();

const port = process.env.PORT ?? (8080 as const);
const LOG_1 = "Beginning main fn invocation..." as const;
const LOG_2 = "Attempting to create db connection..." as const;
const LOG_3 = "Database connection secured!" as const;
const LOG_4 = "Database connection not secured. Retrying..." as const;
const LOG_5 = "DatabaseManager unable to connect. Terminal Op Failure. Server shutting down safely." as const;

type DatabaseRowDataPacket = { Database: string; }
type TableRowDataPacket = { Tables_in_users: string };

/** Establish Database Connection */
async function main(){

  try {

    console.log(LOG_1);
    console.log(LOG_2);
    const databases = await dbService.query(QUERY_DATABASES);
    const databasesIterable = databases as unknown as DatabaseRowDataPacket[];
    if (typeof databasesIterable === "undefined") {
      throw new Error("Could not cast database query to iterable.");
    }

    if (databasesIterable.length === 0) {
      await dbService.query(CREATE_USERS_DATABASE_IF_NOT_EXISTS_COMMAND);
      await dbService.query(CREATE_USERS_TABLE_IF_NOT_EXISTS_COMMAND);
      await dbService.query(CREATE_USER_CARDS_TABLE_IF_NOT_EXISTS_COMMAND);
    } else {
      const tables = await dbService.query(QUERY_TABLES_IN_DATABASE);
      const tablesIterable = tables as unknown as TableRowDataPacket[];
      if (typeof tablesIterable === "undefined") {
        throw new Error("Could not cast tables query to iterable.");
      }

      for (const table of tablesIterable) {
        if (!['users', 'user_cards'].includes(table.Tables_in_users)) {
          throw new Error('Missing table _ ' + table.Tables_in_users + ' from tables iterable.')
        }
      }
    }

    console.log(LOG_3);
    server.listen(port, () => {
      console.log('listening...');
    });

  } catch(e: any) {
    console.error((e as Error).message);
    console.log(LOG_4);
    console.log(LOG_5);
  }
}

main();
