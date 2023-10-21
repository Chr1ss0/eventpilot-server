import mongoose from 'mongoose';
import { Request } from 'express';
import { UserFuncInter, UserInter } from '../shared/types/userTypes';
import { CustomErrType } from '../shared/types/sharedTypes';
import { tokenUserId } from '../utils/token';
import { getZipData } from '../utils/geoHelper';
// import { deleteImage, uploadImage } from '../utils/imageService';

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
      placeName: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
        required: true,
      },
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
  bookmarks: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
    },
  ],
  connections: {
    following: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    followers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
  },
});

userSchema.statics.register = async function register(req: Request): Promise<UserInter | number> {
  try {
    const { email, password, firstName, lastName, zipCode } = req.body;
    const { placeName, state, latitude, longitude } = await getZipData(zipCode);
    const user = new this({
      email,
      password,
      userInfo: {
        firstName,
        lastName,
        defaultLocation: {
          placeName,
          state,
          coordinates: [latitude, longitude],
        },
      },
    });
    await user.save();
    return user;
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number; // Reasonable solution for error
    return 500;
  }
};

userSchema.statics.edit = async function edit(_: Request) {
  try {
    // const userId = tokenUserId(req);
    // const user = await this.findById(userId);
    // if (user && req.file) {
    //   if (user.userInfo.avatar.public_id) await deleteImage(user.userInfo.avatar.public_id);
    //   const { public_id, secure_url } = await uploadImage(req.file.buffer);
    //   const updateAvatar = {
    //     userInfo: {
    //       avatar: {
    //         secure_url,
    //         public_id,
    //       },
    //     },
    //   };
    // }
    // // eslint-disable-next-line @typescript-eslint/naming-convention
    // const { aboutMe, interest, firstName, lastName } = req.body;
    // const updateUser = new this({
    //   userInfo: {
    //     firstName,
    //     lastName,
    //     aboutMe,
    //     interest,
    //   },
    // });
    // await this.findByIdAndUpdate(updateUser);
    return 200;
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number; // Reasonable solution for error
    return 500;
  }
};

userSchema.statics.login = async function login(req: Request): Promise<UserInter | number> {
  const { email, password } = req.body;
  try {
    const user = await this.findOne({ email });

    if (!user || password !== user.password) return 403;

    return user;
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number;
    return 500;
  }
};

userSchema.statics.bookmark = async function bookmark(req: Request): Promise<UserInter | number> {
  try {
    const userId = tokenUserId(req);
    const { event } = req.params;
    const user = await this.findById(userId);

    if (!user) return 500;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (user.bookmarks.includes(event)) await this.findByIdAndUpdate(userId, { $pull: { bookmarks: event } });
    else await this.findByIdAndUpdate(userId, { $addToSet: { bookmarks: event } });

    return (await this.findById(userId)) as UserInter;
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number;
    return 500;
  }
};

userSchema.statics.data = async function data(req: Request) {
  try {
    const userId = tokenUserId(req);
    return await this.findById(userId);
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code;
    return 500;
  }
};

userSchema.statics.dataId = async function dataId(req: Request) {
  const { userId } = req.params;
  try {
    return await this.findById(userId);
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code;
    return 500;
  }
};

// Avatar
userSchema.statics.postReview = async function postReview(req: Request) {
  try {
    const { content, rating, receiver } = req.body;
    const userId = tokenUserId(req);
    const user = await this.findById(userId);

    if (!user) return 500;
    const { firstName } = user.userInfo;
    const review = {
      firstName,
      content,
      rating,
    };
    await this.findByIdAndUpdate(receiver, { $addToSet: { reviews: review } });
    return await this.findById(receiver);
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code;
    return 500;
  }
};

userSchema.statics.editLocation = async function editLocation(req: Request) {
  try {
    const { defaultLocation } = req.body;
    const userId = tokenUserId(req);
    await this.findByIdAndUpdate(userId, { $set: { 'userInfo.defaultLocation': defaultLocation } });
    return await this.findById(userId);
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code;
    return 500;
  }
};

userSchema.statics.follow = async function follow(req: Request) {
  try {
    const { idFollowing } = req.params;
    const userId = tokenUserId(req);
    await this.findByIdAndUpdate(userId, { $addToSet: { 'connections.following': idFollowing } });
    await this.findByIdAndUpdate(idFollowing, { $addToSet: { 'connections.followers': userId } });
    return await this.findById(userId);
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code;
    return 500;
  }
};

const User = mongoose.model<UserInter, UserFuncInter>('User', userSchema);

export default User;
