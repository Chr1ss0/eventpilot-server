import { Model, Document, ObjectId } from 'mongoose';
import { Request } from 'express';
import { CloudUrlType, LocationType } from './sharedTypes';

export type CategoryType = 'Sports' | 'Music' | 'Art' | 'Food';
export interface EventInter extends Document {
  organizer: ObjectId;
  eventInfo: {
    title: string;
    category: CategoryType;
    startDate: string;
    endDate: string;
    location: LocationType;
    description: string;
  };
  cover: CloudUrlType[];
  registeredUser: {
    _id: ObjectId;
  };
}

export type EventFilters = {
  category?: string;
  location?: string | boolean;
  distance?: string;
  date?: string;
  title?: unknown | string;
};

type ResponseType = EventInter | number;
export interface EventFuncInter<T = ResponseType> extends Model<EventInter> {
  createNew(req: Request): Promise<T>;
  regUser(req: Request): Promise<T>;
  getAll(): Promise<T>;
  getOne(req: Request): Promise<T>;
  getFiltered(req: Request): Promise<T>;
}
