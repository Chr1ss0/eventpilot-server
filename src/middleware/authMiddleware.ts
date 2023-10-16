import { NextFunction, Response, Request } from 'express';
import { verifyToken } from '../utils/token';
import { notAcceptedError } from '../utils/errorHandlers';

export default function auth(req: Request, res: Response, next: NextFunction) {
  const { token } = req.cookies;
  try {
    verifyToken(token);
    next();
  } catch (error) {
    console.error(error);
    notAcceptedError(res, 'Token ungültig.');
  }
}
