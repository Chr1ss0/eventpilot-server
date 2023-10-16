import { Request, Response, NextFunction } from 'express';
import { createHmac } from 'crypto';

export default function encrypt(req: Request, _: Response, next: NextFunction) {
  const hmac = createHmac('sha256', req.body.password);
  req.body.password = hmac.digest('hex');
  next();
}
