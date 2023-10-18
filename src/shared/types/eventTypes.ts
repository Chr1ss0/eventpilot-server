import { Model, Document } from 'mongoose';
import { Request } from 'express';
import { CloudUrlType } from './sharedTypes';

export type CategoryType = 'Sports' | 'Music' | 'Art' | 'Food';
export interface EventInter extends Document {
  organizer: string;
  eventInfo: {
    title: string;
    category: CategoryType;
    startDate: string;
    endDate: string;
    location: string;
    description: string;
  };
  cover: CloudUrlType[];
  registeredUser: {
    _id: string;
    secure_url: string;
  };
}

type ResponseType = EventInter | number;
export interface EventFuncInter<T = ResponseType> extends Model<EventInter> {
  createNew(req: Request): Promise<T>;
}
