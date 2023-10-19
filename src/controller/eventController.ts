import { Request, Response } from 'express';
import EventItem from '../models/Event';
import { conflictError, internalServerError } from '../utils/errorHandlers';
import validatorResult from '../validator/validatorResult';

export async function createEvent(req: Request, res: Response) {
  try {
    validatorResult(req, res);
    const result = await EventItem.createNew(req);
    if (typeof result === 'number') {
      if (result === 11000) return conflictError(res, 'Name ist bereits in benutzung.');
      return internalServerError(res, 'Ein Interner Serverfehler ist aufgetreten');
    }
    // eslint-disable-next-line no-underscore-dangle
    return res.status(200).json({ message: `Event: ${result._id}, erfolgreich erstellt` });
  } catch (error) {
    return null; // not so pretty
  }
}

export async function registerUserToEvent(req: Request, res: Response) {
  const result = await EventItem.regUser(req);
  if (typeof result === 'number') return internalServerError(res, 'Ein Interner Serverfehler ist aufgetreten');
  // eslint-disable-next-line no-underscore-dangle
  return res.status(200).json({ message: `Event: ${result._id}, erfolgreich updated` });
}
export async function getAllEvents(_: Request, res: Response) {
  const result = await EventItem.getAll();
  if (typeof result === 'number') return internalServerError(res, 'Ein Interner Serverfehler ist aufgetreten');
  return res.status(200).json(result);
}
export async function getOneEvent(req: Request, res: Response) {
  const result = await EventItem.getOne(req);
  if (typeof result === 'number') return internalServerError(res, 'Ein Interner Serverfehler ist aufgetreten');
  return res.status(200).json(result);
}
// export async function getFilteredEvents(req: Request, res: Response) {
//   res.end('login');
// }
