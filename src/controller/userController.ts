import { Request, Response } from 'express';
import { createToken } from '../utils/token';
import User from '../models/User';
import { conflictError, internalServerError } from '../utils/errorHandlers';

export async function registerUser(req: Request, res: Response) {
  const result = await User.register(req);
  if (typeof result === 'number') {
    if (result === 11000) return conflictError(res, 'Email ist bereits in benutzung.');
    return internalServerError(res, 'Ein Interner Serverfehler ist aufgetreten');
  }
  // eslint-disable-next-line no-underscore-dangle
  const token = createToken({ user: result._id });
  res.cookie('token', token, {
    httpOnly: true,
    secure: true,
    maxAge: 3600000,
  });
  // eslint-disable-next-line no-underscore-dangle
  return res.status(200).json({ message: `User: ${result._id}, erfolgreich registriert` });
}
export async function loginUser(req: Request, res: Response) {
  res.end('login');
}
export async function validateUser(req: Request, res: Response) {
  res.end('login');
}
export async function getUser(req: Request, res: Response) {
  res.end('login');
}
export async function getUserField(req: Request, res: Response) {
  res.end('login');
}
export async function addReview(req: Request, res: Response) {
  res.end('login');
}
export async function bookmarkEvent(req: Request, res: Response) {
  res.end('login');
}
export async function followUser(req: Request, res: Response) {
  res.end('login');
}
export async function editUser(req: Request, res: Response) {
  res.end('login');
}
