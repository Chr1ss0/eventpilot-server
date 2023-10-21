import { Document, Model, ObjectId } from 'mongoose';
import { Request } from 'express';
import { CloudUrlType, LocationType } from './sharedTypes';

export interface UserInter extends Document {
  email: string;
  password: string;
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
}

type ResponseType = UserInter | number;

export interface UserFuncInter<T = ResponseType> extends Model<UserInter> {
  register(req: Request): Promise<T>;
  login(req: Request): Promise<T>;
  bookmark(req: Request): Promise<T>;
  data(req: Request): Promise<T>;
  dataId(req: Request): Promise<T>;
  postReview(req: Request): Promise<T>;
  editLocation(req: Request): Promise<T>;
  follow(req: Request): Promise<T>;
  edit(req: Request): Promise<T>;
}
