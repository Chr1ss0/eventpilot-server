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
  registeredUser: ObjectId[];
}

export type FilterObjType = {
  'eventInfo.category'?: string;
  'eventInfo.location.coordinates'?: string;
  distance?: string;
  'eventInfo.startDate'?: { $gte: Date | number; $lte?: Date | number };
  'eventInfo.title'?: unknown | string;
};

export type ResponseEventType = EventInter | Error | string | number;
export interface EventFuncInter<T = ResponseEventType> extends Model<EventInter> {
  createNew(req: Request): Promise<T>;
  regUser(req: Request): Promise<T>;
  getAll(req: Request): Promise<T>;
  getOne(req: Request): Promise<T>;
  getFiltered(req: Request): Promise<T>;
}
