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
}

export interface UserFuncInter extends Model<UserInter> {
  register(req: Request): Promise<UserInter | number>;
  login(req: Request): Promise<UserInter | number>;
}
