import { Request, Response } from 'express';

export function healthCheckHandler(_req: Request, res: Response) {
  res.json({ health: '240HP' });
}
