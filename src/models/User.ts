import mongoose from 'mongoose';
import { Request } from 'express';
import { UserInter, UserFuncInter } from '../shared/types/userTypes';
import { CustomErrType } from '../shared/types/sharedTypes';

const userSchema = new mongoose.Schema<UserInter, UserFuncInter>({
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  userInfo: {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    aboutMe: {
      type: String,
    },
    interest: {
      type: [String],
    },
    defaultLocation: {
      type: String,
    },
    avatar: {
      secure_url: {
        type: String,
        default:
          'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2629&q=80',
      },
      public_id: {
        type: String,
      },
    },
    reviews: [
      {
        firstName: {
          type: String,
        },
        content: {
          type: String,
        },
        rating: {
          type: Number,
        },
        creationDate: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
});

userSchema.statics.register = async function register(req: Request): Promise<UserInter | number> {
  const { email, password, firstName, lastName } = req.body;
  const user = new this({
    email,
    password,
    userInfo: {
      firstName,
      lastName,
    },
  });
  try {
    await user.save();
    return user;
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number; // Reasonable solution for error
    return 500;
  }
};

userSchema.statics.login = async function login(req: Request) {
  const { email, password } = req.body;
  try {
    const user = await this.findOne({ email });
    if (!user || password !== user.password) return 403;

    return user;
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code;
    return 500;
  }
};

const User = mongoose.model<UserInter, UserFuncInter>('User', userSchema);

export default User;
