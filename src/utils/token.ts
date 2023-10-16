import jwt, { JwtPayload, Secret } from 'jsonwebtoken';
import { Response } from 'express';

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
  res.clearCookie('token');
  res.sendStatus(200);
}
