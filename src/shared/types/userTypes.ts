import { Document, Model } from 'mongoose';
import { Request } from 'express';
import { CloudUrlType } from './sharedTypes';

export interface UserInter extends Document {
  email: string;
  password: string;
  userInfo: {
    firstName: string;
    lastName: string;
    aboutMe: string;
    interest: string[];
    defaultLocation: string;
    avatar: CloudUrlType;
  };
  reviews: {
    firstName: string;
    content: string;
    rating: number;
    creationDate: string;
  }[];
  bookmarks: string[];
  connections: {
    following: string[];
    followers: string[];
  };
}

type ResponseType = UserInter | number;

export interface UserFuncInter<T = ResponseType> extends Model<UserInter> {
  register(req: Request): Promise<T>;
  login(req: Request): Promise<T>;
  bookmark(req: Request): Promise<T>;
  data(req: Request): Promise<T>;
}
