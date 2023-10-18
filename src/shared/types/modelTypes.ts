import { Document } from 'mongoose';

export type CloudinaryURLT = {
  secure_url: string;
  public_id: string;
};
export interface UserI extends Document {
  email: string;
  password: string;
  userInfo: {
    firstName: string;
    lastName: string;
    aboutMe: string;
    interest: string[];
    defaultLocation: string;
    avatar: CloudinaryURLT;
  };
  reviews: {
    firstName: string;
    content: string;
    rating: number;
    creationDate: string;
  }[];
}
