import { Request, Response } from 'express';
import { createTokenAndRes, deleteToken } from '../utils/token';
import User from '../models/User';
import { conflictError, forbiddenError, internalServerError } from '../utils/errorHandlers';

export async function registerUser(req: Request, res: Response) {
  const result = await User.register(req);
  if (typeof result === 'number') {
    if (result === 11000) return conflictError(res, 'Email is already in use.');
    return internalServerError(res);
  }
  // eslint-disable-next-line no-underscore-dangle
  createTokenAndRes(res, result._id);
  // eslint-disable-next-line no-underscore-dangle
  return res.status(200).json({ message: `User: ${result._id}, successfully registered` });
}

export async function loginUser(req: Request, res: Response) {
  const result = await User.login(req);
  if (typeof result === 'number') {
    if (result === 403) return forbiddenError(res, 'Login Data invalid.');
    return internalServerError(res);
  }
  // eslint-disable-next-line no-underscore-dangle
  createTokenAndRes(res, result._id);
  return res.status(200).json({ message: 'Login successfully' });
}
export async function editUser(_: Request, res: Response) {
  res.end();
}

export async function logoutUser(_: Request, res: Response) {
  deleteToken(res);
}

export async function validateUser(_: Request, res: Response) {
  res.status(200).json({ message: 'Token valid' });
}

export async function getUser(req: Request, res: Response) {
  const result = await User.data(req);
  if (typeof result === 'number') return internalServerError(res);
  return res.status(200).json({ userInfo: result.userInfo, bookmarks: result.bookmarks, reviews: result.reviews });
}
export async function getUserId(req: Request, res: Response) {
  const result = await User.dataId(req);
  if (typeof result === 'number') return internalServerError(res);
  return res.status(200).json({ userInfo: result.userInfo, bookmarks: result.bookmarks, reviews: result.reviews });
}

export async function addReview(req: Request, res: Response) {
  const result = await User.postReview(req);
  if (typeof result === 'number') return internalServerError(res);
  return res.status(200).json({ reviews: result.reviews });
}

export async function bookmarkEvent(req: Request, res: Response) {
  const result = await User.bookmark(req);
  if (typeof result === 'number') return internalServerError(res);
  return res.status(200).json({ bookmarks: result.bookmarks });
}

export async function followUser(req: Request, res: Response) {
  const result = await User.follow(req);
  if (typeof result === 'number') return internalServerError(res);
  return res.status(200).json({ following: result.connections.following });
}

export async function patchUser(req: Request, res: Response) {
  const result = await User.editLocation(req);
  if (typeof result === 'number') return internalServerError(res);
  return res.status(200).json({ location: result.userInfo });
}
