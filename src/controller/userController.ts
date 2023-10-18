import { Request, Response } from 'express';
import { createTokenAndRes } from '../utils/token';
import User from '../models/User';
import { conflictError, internalServerError } from '../utils/errorHandlers';

export async function registerUser(req: Request, res: Response) {
  const result = await User.register(req);
  if (typeof result === 'number') {
    if (result === 11000) return conflictError(res, 'Email ist bereits in benutzung.');
    return internalServerError(res, 'Ein Interner Serverfehler ist aufgetreten');
  }
  // eslint-disable-next-line no-underscore-dangle
  createTokenAndRes(res, result._id);
  // eslint-disable-next-line no-underscore-dangle
  return res.status(200).json({ message: `User: ${result._id}, erfolgreich registriert` });
}

export async function loginUser(req: Request, res: Response) {
  const result = await User.login(req);
  if (typeof result === 'number') {
    if (result === 403) return conflictError(res, 'Login Daten sind ungültig.');
    return internalServerError(res, 'Ein Interner Serverfehler ist aufgetreten');
  }
  // eslint-disable-next-line no-underscore-dangle
  createTokenAndRes(res, result._id);
  return res.status(200).json({ message: 'Login erfolgreich' });
}
export async function validateUser(_: Request, res: Response) {
  res.status(200).json({ message: 'Token gültig' });
}
// export async function getUser(req: Request, res: Response) {
//   res.end('login');
// }
// export async function getUserField(req: Request, res: Response) {
//   res.end('login');
// }
// export async function addReview(req: Request, res: Response) {
//   res.end('login');
// }
// export async function bookmarkEvent(req: Request, res: Response) {
//   res.end('login');
// }
// export async function followUser(req: Request, res: Response) {
//   res.end('login');
// }
// export async function editUser(req: Request, res: Response) {
//   res.end('login');
// }
