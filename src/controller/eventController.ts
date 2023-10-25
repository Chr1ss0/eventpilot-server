import { Request, Response } from 'express';
import Event from '../models/Event';
import { conflictError, internalServerError, notAcceptedError } from '../utils/errorHandlers';
import validatorResult from '../validator/validatorResult';

export async function createEvent(req: Request, res: Response) {
  try {
    if (!req.file) throw new Error('No File Found in Request');
    validatorResult(req);
    const result = await Event.createNew(req);
    if (typeof result === 'number') {
      if (result === 11000) return conflictError(res, 'Name is already used.');
      return internalServerError(res);
    }
    // eslint-disable-next-line no-underscore-dangle
    return res.status(200).json({ message: `Event: ${result._id}, created successfully` });
  } catch (error) {
    console.log(error);
    if (error instanceof Error) return notAcceptedError(res, error.message);
    return internalServerError(res);
  }
}

export async function registerUserToEvent(req: Request, res: Response) {
  const result = await Event.regUser(req);
  if (typeof result === 'number') return internalServerError(res);
  // eslint-disable-next-line no-underscore-dangle
  return res.status(200).json({ message: `Event: ${result._id}, successfully updated` });
}

export async function getAllEvents(req: Request, res: Response) {
  const result = await Event.getAll(req);
  if (typeof result === 'number') return internalServerError(res);
  return res.status(200).json(result);
}

export async function getOneEvent(req: Request, res: Response) {
  const result = await Event.getOne(req);
  if (typeof result === 'number') return internalServerError(res);
  return res.status(200).json(result);
}

export async function getFilteredEvents(req: Request, res: Response) {
  const result = await Event.getFiltered(req);
  if (typeof result === 'number') return internalServerError(res);
  return res.status(200).json(result);
}
