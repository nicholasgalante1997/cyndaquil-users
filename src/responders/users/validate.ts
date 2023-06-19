import { Request, Response } from 'express';
import { UserDAO } from '../../types/user';
import { UserService } from '../../services';

export async function createUserHandler(req: Request, res: Response) {
  const { body } = req;
  let userDao: Partial<UserDAO> | undefined;
  try {
    userDao = body as Partial<UserDAO>;
    if (!userDao.email) {
      throw new Error('Missing "email" attribute.');
    }
    if (!userDao.password) {
      throw new Error('Missing "password" attribute.');
    }
    const userService = new UserService();
    const resultOp = await userService.validateUser(userDao.email, userDao.password);
    res
      .status(201)
      .json({ op: 'create_user', status: 'passed', user: resultOp });
    return;
  } catch (e: any) {
    console.error(`[CREATE_FATAL]: ${(e as Error).message}`);
    res.status(500).json({
      op: 'create_user',
      status: 'failed',
      cause: (e as Error).message,
    });
    return;
  }
}
