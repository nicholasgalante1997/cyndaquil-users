import { Request, Response, NextFunction } from 'express';

export function trace(req: Request, _res: Response, next: NextFunction) {
  const { headers } = req;

  const userAgent = headers['user-agent'];
  const referer = headers['referer'];
  const acceptLanguage = headers['accept-language'];
  const contentType = headers['content-type'];
  const contentEncoding = headers['content-encoding'];

  const t = `
    [INFO]: reqline
    *************************************
    user-agent: ${userAgent}
    referrer: ${referer}
    accept-language: ${acceptLanguage}
    content-type: ${contentType}
    content-encoding: ${contentEncoding}
    *************************************
    
    `;

  console.log(t);

  next();
}
