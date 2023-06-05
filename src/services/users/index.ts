import {
  dbService,
  CREATE_USER_INSERT_COMMAND,
  QUERY_USERS_TEMPLATE,
  QUERY_USER_TEMPLATE_BY_ID,
} from '../../db';
import { UserDAO } from '../../types/user';
import { IModel } from '../Model';

export class UserService implements IModel<UserDAO> {
  _tableName = 'users';

  // TODO: cast Query to USERDAO
  async create(item: UserDAO): Promise<UserDAO> {
    const entry = await dbService.query(CREATE_USER_INSERT_COMMAND, [
      item.user_id,
      item.email,
      item.salted_password,
    ]);
    return {
      email: '',
      salted_password: '',
      user_id: '',
    };
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
      salted_password: '',
      user_id: '',
    };
  }

  // TODO: implement
  async update(id: string, item: UserDAO): Promise<UserDAO> {
    return {
      email: '',
      salted_password: '',
      user_id: '',
    };
  }

  // TODO: implement
  async delete(id: string): Promise<UserDAO> {
    return {
      email: '',
      salted_password: '',
      user_id: '',
    };
  }
}
