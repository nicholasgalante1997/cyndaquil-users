import { Request, Response } from "express";
import { UserDAO } from "types/user";
import { UserService } from '../../services';

export async function createUserHandler(req: Request, res: Response) {
    const { body } = req;
    let userDao: UserDAO | undefined;
    try {
        userDao = (body as UserDAO);
        if (!userDao) {
            throw new Error("Invalid JSON body. Does not match UserDAO shape.")
        }
        const userService = new UserService();
        const resultOp = await userService.create(userDao);
        res.status(201).json({ op: 'create_user', status: 'passed', user: resultOp });
        return;
    } catch(e: any) {
        console.error(`[CREATE_FATAL]: ${(e as Error).message}`);
        res.status(301).json({ op: 'create_user', status: 'failed', cause: (e as Error).message});
        return;
    }
}