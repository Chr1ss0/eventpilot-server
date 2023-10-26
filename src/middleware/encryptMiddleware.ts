import { Request, Response, NextFunction } from 'express';
import { createHmac } from 'crypto';
import { internalServerError, notAcceptedError } from '../utils/errorHandlers';

export default function encrypt(req: Request, res: Response, next: NextFunction) {
  const { password } = req.body;
  try {
    if (!password) throw new Error('No Password on request');
    const hmac = createHmac('sha256', password);
    req.body.password = hmac.digest('hex');
    return next();
  } catch (error) {
    if (error instanceof Error) return notAcceptedError(res, error.message);
    return internalServerError(res);
  }
}
