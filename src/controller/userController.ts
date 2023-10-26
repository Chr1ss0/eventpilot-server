import { Request, Response } from 'express';
import { createTokenAndRes } from '../utils/token';
import User from '../models/User';
import { errorHandlerCatch, errorHandlerController, forbiddenError, internalServerError } from '../utils/errorHandlers';
import validatorResult from '../validator/validatorResult';

export async function registerUser(req: Request, res: Response) {
  try {
    validatorResult(req);
    const responseDb = await User.register(req);
    const result = errorHandlerController(responseDb, 11000, 'Email already in use.');
    // eslint-disable-next-line no-underscore-dangle
    createTokenAndRes(res, result._id);
    // eslint-disable-next-line no-underscore-dangle
    return res.status(200).json({ message: `User: ${result.email}, successfully registered` });
  } catch (error) {
    return errorHandlerCatch(error, res);
  }
}

export async function loginUser(req: Request, res: Response) {
  try {
    const result = await User.login(req);
    if (result instanceof Error) return forbiddenError(res, result.message);
    if (typeof result === 'string' || typeof result === 'number') return internalServerError(res); // cant be of type number but want forbidden
    // eslint-disable-next-line no-underscore-dangle
    createTokenAndRes(res, result._id);
    return res.status(200).json({ message: 'Login successfully' });
  } catch (error) {
    return errorHandlerCatch(error, res);
  }
}

export async function editUser(req: Request, res: Response) {
  try {
    validatorResult(req);
    const responseDb = await User.edit(req);
    const result = errorHandlerController(responseDb);
    return res.status(200).json(result);
  } catch (error) {
    return errorHandlerCatch(error, res);
  }
}

export async function logoutUser(_: Request, res: Response) {
  res.clearCookie('eventpilot').json({ message: 'Successfully Logout' });
}

export async function validateUser(_: Request, res: Response) {
  res.status(200).json({ message: 'Token valid' });
}

export async function getUser(req: Request, res: Response) {
  try {
    const responseDb = await User.data(req);
    const result = errorHandlerController(responseDb);
    return res.status(200).json(result);
  } catch (error) {
    return errorHandlerCatch(error, res);
  }
}
export async function getUserId(req: Request, res: Response) {
  try {
    const responseDb = await User.dataId(req);
    const result = errorHandlerController(responseDb);
    return res.status(200).json(result);
  } catch (error) {
    return errorHandlerCatch(error, res);
  }
}

export async function addReview(req: Request, res: Response) {
  try {
    validatorResult(req);
    const responseDb = await User.postReview(req);
    const result = errorHandlerController(responseDb);
    // eslint-disable-next-line no-underscore-dangle
    return res.status(200).json({ message: `Review: ${result._id}, successfully created` });
  } catch (error) {
    return errorHandlerCatch(error, res);
  }
}

export async function bookmarkEvent(req: Request, res: Response) {
  try {
    const responseDb = await User.bookmark(req);
    errorHandlerController(responseDb);
    return res.status(200).json({ message: 'Bookmark event successfully' });
  } catch (error) {
    return errorHandlerCatch(error, res);
  }
}

export async function followUser(req: Request, res: Response) {
  try {
    const responseDb = await User.follow(req);
    errorHandlerController(responseDb);
    return res.status(200).json({ message: 'Following successfully' });
  } catch (error) {
    return errorHandlerCatch(error, res);
  }
}

export async function getWatchList(req: Request, res: Response) {
  try {
    const responseDb = await User.wishList(req);
    const result = errorHandlerController(responseDb);
    return res.status(200).json(result);
  } catch (error) {
    return errorHandlerCatch(error, res);
  }
}
