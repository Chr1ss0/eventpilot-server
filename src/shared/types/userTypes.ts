import { Document, Model, ObjectId } from 'mongoose';
import { Request } from 'express';
import { CloudUrlType, LocationType } from './sharedTypes';
import { EventInter } from './eventTypes';
import { MongoError } from 'mongodb';

export interface UserInter extends Document {
  email: string;
  password?: string;
  userInfo: {
    firstName: string;
    lastName: string;
    aboutMe: string;
    interest: string[];
    defaultLocation: LocationType;
    avatar: CloudUrlType;
  };
  reviews: {
    userId: ObjectId;
    content: string;
    rating: number;
    creationDate: string;
  }[];
  bookmarks: ObjectId[];
  connections: {
    following: ObjectId[];
    followers: ObjectId[];
  };
  createdEvents?: EventInter[];
}

export type UpdateUserObjType = {
  'userInfo.avatar.secure_url'?: string;
  'userInfo.avatar.public_id'?: string;
  'userInfo.defaultLocation.placeName'?: string;
  'userInfo.defaultLocation.state'?: string;
  'userInfo.defaultLocation.coordinates'?: [number, number];
  'userInfo.firstName'?: string;
  'userInfo.lastName'?: string;
  'userInfo.aboutMe'?: string;
  'userInfo.interest'?: string[];
};

type ResponseType = UserInter | Error | MongoError | string;

export interface UserFuncInter<T = ResponseType> extends Model<UserInter> {
  register(req: Request): Promise<T>;
  login(req: Request): Promise<T>;
  bookmark(req: Request): Promise<T>;
  data(req: Request): Promise<T>;
  dataId(req: Request): Promise<T>;
  postReview(req: Request): Promise<T>;
  follow(req: Request): Promise<T>;
  edit(req: Request): Promise<T>;
  wishList(req: Request): Promise<T>;
}
