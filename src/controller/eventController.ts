import { Request, Response } from 'express';
import EventItem from '../models/Event';
import { conflictError, internalServerError } from '../utils/errorHandlers';
import validatorResult from '../validator/validatorResult';

async function createEvent(req: Request, res: Response) {
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
  // eslint-disable-next-line no-underscore-dangle
}

export default createEvent;
// export async function registerUserToEvent(req: Request, res: Response) {
//   res.end('login');
// }
// export async function getAllEvents(req: Request, res: Response) {
//   res.end('login');
// }
// export async function getFilteredEvents(req: Request, res: Response) {
//   res.end('login');
// }
