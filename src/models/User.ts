import mongoose from 'mongoose';
import { Request } from 'express';
import { UpdateUserObjType, UserFuncInter, UserInter } from '../shared/types/userTypes';
import { tokenUserId } from '../utils/token';
import { deleteImage, uploadImage } from '../utils/imageService';
import { errorHandlerModel } from '../utils/errorHandlers';

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
          'https://images.unsplash.com/photo-1519575706483-221027bfbb31?auto=format&fit=crop&q=80&w=3871&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
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

userSchema.statics.register = async function register(req: Request) {
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
    return await user.save();
  } catch (error) {
    return errorHandlerModel(error);
  }
};

userSchema.statics.edit = async function edit(req: Request) {
  try {
    const userUpdateObj: UpdateUserObjType = {};

    if (req.file) {
      const user = await this.findById(tokenUserId(req), { password: false, email: false });
      if (!user) throw new Error('No User found.');
      if (user.userInfo.avatar.public_id) await deleteImage(user.userInfo.avatar.public_id);
      // eslint-disable-next-line @typescript-eslint/naming-convention
      const { public_id, secure_url } = await uploadImage(req.file.buffer);
      userUpdateObj['userInfo.avatar.secure_url'] = secure_url;
      userUpdateObj['userInfo.avatar.public_id'] = public_id;
    }
    const { aboutMe, interest, firstName, lastName, placeName, state, latitude, longitude } = req.body;

    if (latitude && longitude && placeName && state) {
      userUpdateObj['userInfo.defaultLocation.placeName'] = placeName;
      userUpdateObj['userInfo.defaultLocation.state'] = state;
      userUpdateObj['userInfo.defaultLocation.coordinates'] = [latitude, longitude];
    }

    const interestArray = interest.replaceAll(' ', '').split(',');

    userUpdateObj['userInfo.firstName'] = firstName;
    userUpdateObj['userInfo.lastName'] = lastName;
    userUpdateObj['userInfo.aboutMe'] = aboutMe;
    userUpdateObj['userInfo.interest'] = interestArray;

    return await this.findByIdAndUpdate(tokenUserId(req), { $set: userUpdateObj }, { new: true });
  } catch (error) {
    return errorHandlerModel(error);
  }
};

userSchema.statics.login = async function login(req: Request) {
  const { email, password } = req.body;
  try {
    if (!email) throw new Error('No Email on request.');
    const user = await this.findOne({ email });
    if (!user || password !== user.password) throw new Error('Invalid Login data.');
    return user;
  } catch (error) {
    return errorHandlerModel(error);
  }
};

userSchema.statics.bookmark = async function bookmark(req: Request) {
  try {
    const userId = tokenUserId(req);
    const { event } = req.params;
    const user = await this.findById(userId);
    if (!user) throw new Error('No User found.');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (user.bookmarks.includes(event))
      return await this.findByIdAndUpdate(userId, { $pull: { bookmarks: event } }, { new: true });
    return await this.findByIdAndUpdate(userId, { $addToSet: { bookmarks: event } }, { new: true });
  } catch (error) {
    return errorHandlerModel(error);
  }
};

userSchema.statics.data = async function data(req: Request) {
  const userId = tokenUserId(req);
  try {
    return await this.findById(userId, { password: false })
      .populate('reviews.postUser', 'userInfo.firstName userInfo.avatar.secure_url')
      .populate({
        path: 'createdEvents',
        select: '-registeredUser',
        options: { sort: { startDate: 1 } },
      })
      .exec();
  } catch (error) {
    return errorHandlerModel(error);
  }
};

userSchema.statics.dataId = async function dataId(req: Request) {
  const { userId } = req.params;
  try {
    return await this.findById(userId, { password: false, email: false })
      .populate('reviews.postUser', 'userInfo.firstName userInfo.avatar.secure_url')
      .populate({
        path: 'createdEvents',
        select: '-registeredUser',
        options: { sort: { startDate: 1 } },
      })
      .exec();
  } catch (error) {
    return errorHandlerModel(error);
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
  } catch (error) {
    return errorHandlerModel(error);
  }
};

userSchema.statics.follow = async function follow(req: Request) {
  try {
    const { followingId } = req.params;
    const userId = tokenUserId(req);

    const user = await this.findById(userId);
    const userToFollow = await this.findById(followingId);

    if (!user || !userToFollow || followingId === userId) return 500;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line no-underscore-dangle
    if (user.connections.following.includes(followingId)) {
      await this.findByIdAndUpdate(userId, { $pull: { 'connections.following': followingId } });
      await this.findByIdAndUpdate(followingId, { $pull: { 'connections.followers': userId } });
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      // eslint-disable-next-line no-underscore-dangle
    } else if (!user.connections.following.includes(followingId)) {
      await this.findByIdAndUpdate(userId, { $addToSet: { 'connections.following': followingId } });
      await this.findByIdAndUpdate(followingId, { $addToSet: { 'connections.followers': userId } });
    }

    return await this.findById(userId);
  } catch (error) {
    return errorHandlerModel(error);
  }
};

userSchema.statics.wishList = async function wishList(req: Request) {
  try {
    return await this.findById(tokenUserId(req))
      .select('-userInfo -password -email -connections -reviews')
      .populate({
        path: 'bookmarks',
        select: ' -registeredUser -organizer',
        match: {
          'eventInfo.startDate': { $gte: new Date() },
        },
        options: { sort: { startDate: 1 } },
      })
      .populate({
        path: 'bookedEvents',
        select: 'eventInfo cover -registeredUser',
        match: {
          'eventInfo.startDate': { $gte: new Date() },
        },
        options: { sort: { startDate: 1 } },
      })
      .exec();
  } catch (error) {
    return errorHandlerModel(error);
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
