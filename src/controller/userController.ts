import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import { createTokenAndRes } from '../utils/token';
import User from '../models/User';
import { conflictError, forbiddenError, internalServerError, notAcceptedError } from '../utils/errorHandlers';
import validatorResult from '../validator/validatorResult';

export async function registerUser(req: Request, res: Response) {
  try {
    validatorResult(req);
    const result = await User.register(req);
    if (result instanceof MongoError && result.code === 11000) return conflictError(res, 'Email already in use.');
    if (result instanceof Error) return conflictError(res, result.message);
    if (typeof result === 'string') return internalServerError(res, result);
    // eslint-disable-next-line no-underscore-dangle
    createTokenAndRes(res, result._id);
    // eslint-disable-next-line no-underscore-dangle
    return res.status(200).json({ message: `User: ${result.email}, successfully registered` });
  } catch (error) {
    if (typeof error === 'string') return notAcceptedError(res, error);
    if (error instanceof Error) return notAcceptedError(res, error.message);
    return internalServerError(res);
  }
}

export async function loginUser(req: Request, res: Response) {
  const result = await User.login(req);
  if (result instanceof Error) return forbiddenError(res, result.message);
  if (typeof result === 'string') return internalServerError(res, result);
  // eslint-disable-next-line no-underscore-dangle
  createTokenAndRes(res, result._id);
  return res.status(200).json({ message: 'Login successfully' });
}

export async function editUser(req: Request, res: Response) {
  try {
    validatorResult(req);
    const result = await User.edit(req);
    if (result instanceof Error) return notAcceptedError(res, result.message);
    if (typeof result === 'string') return internalServerError(res, result);
    return res.status(200).json(result);
  } catch (error) {
    if (typeof error === 'string') return notAcceptedError(res, error);
    return internalServerError(res);
  }
}

export async function logoutUser(_: Request, res: Response) {
  res.clearCookie('eventpilot').json({ message: 'Successfully Logout' });
}

export async function validateUser(_: Request, res: Response) {
  res.status(200).json({ message: 'Token valid' });
}

export async function getUser(req: Request, res: Response) {
  const result = await User.data(req);
  if (result instanceof Error) return conflictError(res, result.message);
  if (typeof result === 'string') return internalServerError(res, result);
  return res.status(200).json(result);
}
export async function getUserId(req: Request, res: Response) {
  const result = await User.dataId(req);
  if (result instanceof Error) return conflictError(res, result.message);
  if (typeof result === 'string') return internalServerError(res, result);
  return res.status(200).json(result);
}

export async function addReview(req: Request, res: Response) {
  try {
    validatorResult(req);
    const result = await User.postReview(req);
    if (result instanceof Error) return conflictError(res, result.message);
    if (typeof result === 'string') return internalServerError(res, result);
    // eslint-disable-next-line no-underscore-dangle
    return res.status(200).json({ message: `Review: ${result._id}, successfully created` });
  } catch (error) {
    if (typeof error === 'string') return notAcceptedError(res, error);
    return internalServerError(res);
  }
}

export async function bookmarkEvent(req: Request, res: Response) {
  const result = await User.bookmark(req);
  if (result instanceof Error) return conflictError(res, result.message);
  if (typeof result === 'string') return internalServerError(res, result);
  return res.status(200).json({ message: 'Bookmark event successfully' });
}

export async function followUser(req: Request, res: Response) {
  const result = await User.follow(req);
  if (result instanceof Error) return conflictError(res, result.message);
  if (typeof result === 'string') return internalServerError(res, result);
  return res.status(200).json({ message: 'Following successfully' });
}

export async function getWatchList(req: Request, res: Response) {
  const result = await User.wishList(req);
  if (result instanceof Error) return conflictError(res, result.message);
  if (typeof result === 'string') return internalServerError(res, result);
  return res.status(200).json(result);
}
