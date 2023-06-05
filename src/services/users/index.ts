import { v4 as uuid } from 'uuid';
import {
  dbService,
  CREATE_USER_INSERT_COMMAND,
  QUERY_USERS_TEMPLATE,
  QUERY_USER_TEMPLATE_BY_ID,
  QUERY_USER_TEMPLATE_BY_EMAIL,
} from '../../db';
import { UserDAO } from '../../types/user';
import { IModel, SQLCreateQueryResult } from '../Model';
import { logger } from '../../utils';

export class UserService implements IModel<UserDAO> {
  _tableName = 'users';

  // TODO: cast Query to USERDAO
  async create(item: { email: string, password: string }): Promise<SQLCreateQueryResult> {
    try {
      logger.info('Attempting to write user to database');
      /** check if the email already exists in the database */
      logger.info('Checking to see if user exists...');
      const existingUser = await dbService.query(QUERY_USER_TEMPLATE_BY_EMAIL, [item.email]);
      /** if we have an existing user, throw error */
      if (existingUser.length > 0) {
        logger.warn('User exists.');
        logger.error('[CyndaquilUserService#create:EmailExistsException]');
        throw new Error('[CyndaquilUserService#create:EmailExistsException]');
      }
      /** create a unique id */
      const user_id = uuid();
      /** attempt to create a user */
      const entry = await dbService.query(CREATE_USER_INSERT_COMMAND, [
        user_id,
        item.email,
        item.password,
      ]);
      /** log result */
      logger.info('Created entry - ' + JSON.stringify(entry));
      return { result: true };
    } catch (e: any) {
      logger.error(e);
      return { result: false, err: JSON.stringify(e) };
    }
  }

  // TODO: cast Query to USERDAO[]
  async readAll(): Promise<UserDAO[]> {
    const entries = await dbService.query(QUERY_USERS_TEMPLATE);
    console.log({ entries });
    return [];
  }

  // TODO: cast Query to USERDAO
  async readById(id: string): Promise<UserDAO> {
    const entry = await dbService.query(QUERY_USER_TEMPLATE_BY_ID, [id]);
    console.log({ entry });
    return {
      email: '',
      password: '',
      userId: '',
    };
  }

  // TODO: implement
  async update(id: string, item: UserDAO): Promise<UserDAO> {
    return {
      email: '',
      password: '',
      userId: '',
    };
  }

  // TODO: implement
  async delete(id: string): Promise<UserDAO> {
    return {
      email: '',
      password: '',
      userId: '',
    };
  }
}
