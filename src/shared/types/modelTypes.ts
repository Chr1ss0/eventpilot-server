import mongoose from 'mongoose';

export interface UserInterface extends mongoose.Document {
  readonly _id: mongoose.Types.ObjectId;
  email: string;
  password: string;
  isAdmin: boolean;
}

export type Image = {
  secure_url: string;
  public_id: string;
};
