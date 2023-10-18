import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { Request, Response } from 'express';

export const tokenConfig = { httpOnly: true, secure: true, maxAge: 3600000 };
const { JWT_SECRET } = process.env;

if (!JWT_SECRET || typeof JWT_SECRET !== 'string') {
  throw new Error('JWT_SECRET is undefined or not a string');
}

export function createToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET as Secret, { expiresIn: '1h' });
}

export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, JWT_SECRET as Secret) as JwtPayload;
  } catch (error) {
    throw new Error(`Verify token failed! : ${error}`);
  }
}

export function deleteToken(res: Response) {
  res.clearCookie('eventpilot');
  res.sendStatus(200);
}

export function createTokenAndRes(res: Response, id: string) {
  const token = createToken({ user: id });
  res.cookie('eventpilot', token, tokenConfig);
}

export function tokenUserId(req: Request): string {
  const { eventpilot } = req.cookies;
  const userId = verifyToken(eventpilot);
  return userId.user;
}
