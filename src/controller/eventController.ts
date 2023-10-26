import { Request, Response } from 'express';
import { MongoError } from 'mongodb';
import Event from '../models/Event';
import { conflictError, internalServerError, notAcceptedError } from '../utils/errorHandlers';
import validatorResult from '../validator/validatorResult';

export async function createEvent(req: Request, res: Response) {
  try {
    if (!req.file) throw new Error('No File Found in Request');
    validatorResult(req);
    const result = await Event.createNew(req);
    if (result instanceof MongoError && result.code === 11000) return conflictError(res, 'Title already in use.');
    if (result instanceof Error) return conflictError(res, result.message);
    if (typeof result === 'string') return internalServerError(res, result);
    // eslint-disable-next-line no-underscore-dangle
    return res.status(200).json({ _id: result._id });
  } catch (error) {
    if (typeof error === 'string') return notAcceptedError(res, error);
    if (error instanceof Error) return notAcceptedError(res, error.message);
    return internalServerError(res);
  }
}

export async function registerUserToEvent(req: Request, res: Response) {
  const result = await Event.regUser(req);
  if (result instanceof Error) return conflictError(res, result.message);
  if (typeof result === 'string') return internalServerError(res, result);
  // eslint-disable-next-line no-underscore-dangle
  return res.status(200).json({ message: `Event: ${result._id}, successfully updated` });
}

export async function getAllEvents(req: Request, res: Response) {
  const result = await Event.getAll(req);
  if (result instanceof Error) return conflictError(res, result.message);
  if (typeof result === 'string') return internalServerError(res, result);
  return res.status(200).json(result);
}

export async function getOneEvent(req: Request, res: Response) {
  const result = await Event.getOne(req);
  if (result instanceof Error) return conflictError(res, result.message);
  if (typeof result === 'string') return internalServerError(res, result);
  return res.status(200).json(result);
}

export async function getFilteredEvents(req: Request, res: Response) {
  const result = await Event.getFiltered(req);
  if (result instanceof Error) return conflictError(res, result.message);
  if (typeof result === 'string') return internalServerError(res, result);
  return res.status(200).json(result);
}
