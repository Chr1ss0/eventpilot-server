import { Response } from 'express';

export function errorFunction(res: Response, status: number, message: string) {
  res.status(status).json({ message: `${message}` });
}
export function internalServerError(res: Response, message: string) {
  errorFunction(res, 500, message);
}
export function conflictError(res: Response, message: string) {
  errorFunction(res, 409, message);
}
export function notAcceptedError(res: Response, message: string) {
  errorFunction(res, 406, message);
}
export function forbiddenError(res: Response, message: string) {
  errorFunction(res, 403, message);
}
