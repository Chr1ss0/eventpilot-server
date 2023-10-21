import { NextFunction, Response, Request } from 'express';
import { verifyToken } from '../utils/token';
import { notAcceptedError } from '../utils/errorHandlers';

export default function auth(req: Request, res: Response, next: NextFunction) {
  const { eventpilot } = req.cookies;
  try {
    verifyToken(eventpilot);
    next();
  } catch (error) {
    console.error(error);
    notAcceptedError(res, 'Token invalid.');
  }
}
