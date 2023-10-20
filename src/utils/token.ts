import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { Request, Response } from 'express';

export const cookieConfig = { httpOnly: true, secure: true, maxAge: 3600000 };
export const tokenConfig = { expiresIn: '1h' };

const { JWT_SECRET } = process.env;

if (!JWT_SECRET || typeof JWT_SECRET !== 'string') {
  throw new Error('JWT_SECRET is undefined or not a string');
}

export function createToken(payload: JwtPayload): string {
  return jwt.sign(payload, JWT_SECRET as Secret, tokenConfig);
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
  res.cookie('eventpilot', token, cookieConfig);
}

export function tokenUserId(req: Request): string {
  const { eventpilot } = req.cookies;
  const userId = verifyToken(eventpilot);
  return userId.user;
}
