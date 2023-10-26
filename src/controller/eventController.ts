import { Request, Response } from 'express';
import Event from '../models/Event';
import { errorHandlerCatch, errorHandlerController } from '../utils/errorHandlers';
import validatorResult from '../validator/validatorResult';

export async function createEvent(req: Request, res: Response) {
  try {
    if (!req.file) throw new Error('No File Found in Request');
    validatorResult(req);
    const responseDb = await Event.createNew(req);
    const result = errorHandlerController(responseDb, 11000, 'Title already in use.');
    // eslint-disable-next-line no-underscore-dangle
    return res.status(200).json({ _id: result._id });
  } catch (error) {
    return errorHandlerCatch(error, res);
  }
}

export async function registerUserToEvent(req: Request, res: Response) {
  try {
    const responseDb = await Event.regUser(req);
    const result = errorHandlerController(responseDb);
    // eslint-disable-next-line no-underscore-dangle
    return res.status(200).json({ message: `Event: ${result._id}, successfully updated` });
  } catch (error) {
    return errorHandlerCatch(error, res);
  }
}

export async function getAllEvents(req: Request, res: Response) {
  try {
    const responseDb = await Event.getAll(req);
    const result = errorHandlerController(responseDb);

    return res.status(200).json(result);
  } catch (error) {
    return errorHandlerCatch(error, res);
  }
}

export async function getOneEvent(req: Request, res: Response) {
  try {
    const responseDb = await Event.getOne(req);
    const result = errorHandlerController(responseDb);
    return res.status(200).json(result);
  } catch (error) {
    return errorHandlerCatch(error, res);
  }
}

export async function getFilteredEvents(req: Request, res: Response) {
  try {
    const responseDb = await Event.getFiltered(req);
    const result = errorHandlerController(responseDb);
    return res.status(200).json(result);
  } catch (error) {
    return errorHandlerCatch(error, res);
  }
}
