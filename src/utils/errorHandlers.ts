import { Response } from 'express';
import { EventInter, ResponseEventType } from '../shared/types/eventTypes';
import { ResponseUserType, UserInter } from '../shared/types/userTypes';

export const unknownErrorMessage = 'An unknown Error occurred';
export function errorFunction(res: Response, status: number, message: string) {
  res.status(status).json({ message: `${message}` });
}
export function internalServerError(res: Response, message = 'Internal Server Error') {
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

export function errorHandlerModel(error: Error | unknown) {
  if (error instanceof Error && 'code' in error) return error.code as number;
  if (error instanceof Error) return error.message;
  return unknownErrorMessage;
}
export function errorHandlerCatch(error: Error | unknown, res: Response) {
  if (typeof error === 'string') return notAcceptedError(res, error);
  if (error instanceof Error) return conflictError(res, error.message);
  return internalServerError(res);
}

export function errorHandlerController(result: ResponseEventType | ResponseUserType, errorCode?: number, msg?: string) {
  if (typeof result === 'number' && result === errorCode) throw new Error(msg);
  if (typeof result === 'string') throw new Error(result);
  if (result instanceof Error) throw new Error(result.message);
  if (typeof result === 'number') throw new Error(unknownErrorMessage);
  return result as UserInter & EventInter;
}
