import { Request, Response } from 'express';
import { createTokenAndRes, deleteToken } from '../utils/token';
import User from '../models/User';
import { conflictError, forbiddenError, internalServerError, notAcceptedError } from '../utils/errorHandlers';
import validatorResult from '../validator/validatorResult';

export async function registerUser(req: Request, res: Response) {
  try {
    validatorResult(req);
    const result = await User.register(req);
    if (typeof result === 'number') {
      if (result === 11000) return conflictError(res, 'Email is already in use.');
      return internalServerError(res);
    }
    // eslint-disable-next-line no-underscore-dangle
    createTokenAndRes(res, result._id);
    // eslint-disable-next-line no-underscore-dangle
    return res.status(200).json({ message: `User: ${result._id}, successfully registered` });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) return notAcceptedError(res, error.message);
    return internalServerError(res);
  }
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
export async function editUser(req: Request, res: Response) {
  try {
    validatorResult(req);
    const result = await User.edit(req);
    if (typeof result === 'number') throw new Error('Internal Server Error');
    return res.status(200).json({ result });
  } catch (error) {
    if (error instanceof Error) return notAcceptedError(res, error.message);
    return internalServerError(res);
  }
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
  return res.status(200).json(result);
}
export async function getUserId(req: Request, res: Response) {
  const result = await User.dataId(req);
  if (typeof result === 'number') return internalServerError(res);
  return res.status(200).json(result);
}

export async function addReview(req: Request, res: Response) {
  const result = await User.postReview(req);
  if (typeof result === 'number') return internalServerError(res);
  return res.status(200).json(result.reviews);
}

export async function bookmarkEvent(req: Request, res: Response) {
  const result = await User.bookmark(req);
  if (typeof result === 'number') return internalServerError(res);
  return res.status(200).json(result.bookmarks);
}

export async function followUser(req: Request, res: Response) {
  const result = await User.follow(req);
  if (typeof result === 'number') return internalServerError(res);
  return res.status(200).json(result.connections.following);
}

export async function getWatchList(req: Request, res: Response) {
  const result = await User.wishList(req);
  if (typeof result === 'number') return internalServerError(res);
  return res.status(200).json(result);
}
