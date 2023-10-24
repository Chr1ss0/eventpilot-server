import mongoose from 'mongoose';
import { Request } from 'express';
import { UserFuncInter, UserInter } from '../shared/types/userTypes';
import { CustomErrType } from '../shared/types/sharedTypes';
import { tokenUserId } from '../utils/token';
// import { getZipData } from '../utils/geoHelper';
import { deleteImage, uploadImage } from '../utils/imageService';

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
      },
      state: {
        type: String,
      },
      coordinates: {
        type: [Number],
        index: '2dsphere',
      },
    },
    avatar: {
      secure_url: {
        type: String,
        default:
          'https://images.unsplash.com/photo-1582266255765-fa5cf1a1d501?auto=format&fit=crop&q=80&w=2940&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      },
      public_id: {
        type: String,
      },
    },
  },
  reviews: [
    {
      postUser: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
    const { email, password, firstName, lastName } = req.body;
    // const { placeName, state, latitude, longitude } = await getZipData(zipCode);
    const user = new this({
      email,
      password,
      userInfo: {
        firstName,
        lastName,
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

userSchema.statics.edit = async function edit(req: Request) {
  try {
    const userId = tokenUserId(req);
    const user = await this.findById(userId);
    if (!user) return 500;
    if (user && req.file) {
      if (user.userInfo.avatar.public_id) await deleteImage(user.userInfo.avatar.public_id);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { public_id, secure_url } = await uploadImage(req.file.buffer);
      console.log(secure_url);
      const updateAvatar = {
        $set: {
          'userInfo.avatar.secure_url': secure_url,
          'userInfo.avatar.public_id': public_id,
        },
      };
      await this.findByIdAndUpdate(userId, updateAvatar);
    }
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { aboutMe, interest: interestString, firstName, lastName } = req.body;
    const interest = interestString.replaceAll(' ', '').split(',');
    //
    const updateUser = {
      $set: {
        'userInfo.firstName': firstName,
        'userInfo.lastName': lastName,
        'userInfo.aboutMe': aboutMe,
        'userInfo.interest': interest,
      },
    };
    return await this.findByIdAndUpdate(userId, updateUser, { new: true });
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
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number;
    return 500;
  }
};

userSchema.statics.bookmark = async function bookmark(req: Request) {
  try {
    const userId = tokenUserId(req);
    const { event } = req.params;
    const user = await this.findById(userId);
    if (!user) return 500;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (user.bookmarks.includes(event))
      return await this.findByIdAndUpdate(userId, { $pull: { bookmarks: event } }, { new: true });
    return await this.findByIdAndUpdate(userId, { $addToSet: { bookmarks: event } }, { new: true });
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number;
    return 500;
  }
};

userSchema.statics.data = async function data(req: Request) {
  const userId = tokenUserId(req);
  try {
    const doc = await this.findById(userId, { password: false })
      .populate('reviews.postUser', 'postUser.firstName postUser.avatar.secure_url')
      .populate('createdEvents')
      .populate('bookedEvents')
      .populate({
        path: 'bookmarks',
        select: '-registeredUser',
      })
      .exec();

    return doc;
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code;
    return 500;
  }
};

userSchema.statics.dataId = async function dataId(req: Request) {
  const { userId } = req.params;
  try {
    return await this.findById(userId, { password: false, email: false })
      .populate('reviews.postUser', 'postUser.firstName postUser.avatar.secure_url')
      .populate('createdEvents')
      .exec();
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code;
    return 500;
  }
};

userSchema.statics.postReview = async function postReview(req: Request) {
  try {
    const { content, rating, receiver } = req.body;
    const postUser = tokenUserId(req);
    const reviews = {
      postUser,
      content,
      rating,
    };
    return await this.findByIdAndUpdate(receiver, { $addToSet: { reviews } }, { new: true });
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code;
    return 500;
  }
};

userSchema.statics.editLocation = async function editLocation(req: Request) {
  try {
    const { placeName, state, latitude, longitude } = req.body;
    if (!placeName || !state || !longitude || !latitude) throw new Error('Informations missing');
    const updateLocation = {
      $set: {
        'userInfo.defaultLocation.placeName': placeName,
        'userInfo.defaultLocation.state': state,
        'userInfo.defaultLocation.coordinates': [latitude, longitude],
      },
    };
    return await this.findByIdAndUpdate(tokenUserId(req), updateLocation, { new: true });
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code;
    return 500;
  }
};

userSchema.statics.follow = async function follow(req: Request) {
  try {
    const { followingId } = req.params;
    const userId = tokenUserId(req);

    const user = await this.findById(userId);
    const userToFollow = await this.findById(followingId);

    if (!user || !userToFollow) return 500;

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    if (user.connections.following.includes(followingId) && followingId !== user._id) {
      await this.findByIdAndUpdate(userId, { $pull: { 'connections.following': followingId } });
      await this.findByIdAndUpdate(followingId, { $pull: { 'connections.followers': userId } });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-underscore-dangle
    } else if (!user.connections.following.includes(followingId) && followingId !== user._id) {
      await this.findByIdAndUpdate(userId, { $addToSet: { 'connections.following': followingId } });
      await this.findByIdAndUpdate(followingId, { $addToSet: { 'connections.followers': userId } });
    }

    return await this.findById(userId);
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code;
    return 500;
  }
};

userSchema.virtual('createdEvents', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'organizer',
});

userSchema.virtual('bookedEvents', {
  ref: 'Event',
  localField: '_id',
  foreignField: 'registeredUser',
});

userSchema.set('toObject', { virtuals: true });
userSchema.set('toJSON', { virtuals: true });

const User = mongoose.model<UserInter, UserFuncInter>('User', userSchema);

export default User;
