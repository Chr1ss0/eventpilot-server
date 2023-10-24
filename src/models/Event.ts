import mongoose, { SortOrder } from 'mongoose';
import { Request } from 'express';
import { EventFilters, EventFuncInter, EventInter } from '../shared/types/eventTypes';
import { CustomErrType, SearchLocation } from '../shared/types/sharedTypes';
import { tokenUserId } from '../utils/token';
import { uploadImage } from '../utils/imageService';
import { UserInter } from '../shared/types/userTypes';
import { getEndOfDay, getStartOfTomorrow } from '../utils/timeHelper';
import User from './User';

const eventSchema = new mongoose.Schema<EventInter, EventFuncInter>({
  organizer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  eventInfo: {
    title: {
      type: String,
      unique: true,
      trim: true,
    },
    category: {
      type: String,
      enum: ['Sport', 'Music', 'Art', 'Food'],
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    location: {
      placeName: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
        trim: true,
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
    description: {
      type: String,
      required: true,
      trim: true,
    },
  },
  cover: {
    secure_url: {
      type: String,
      required: true,
    },
    public_id: {
      type: String,
    },
  },

  registeredUser: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  ],
});

eventSchema.statics.createNew = async function createNew(req: Request) {
  try {
    const { title, category, startDate, endDate, description, latitude, longitude, placeName, state, address } =
      req.body;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { secure_url, public_id } = await uploadImage(req.file.buffer);
    const organizer = tokenUserId(req);
    const event = new this({
      organizer,
      eventInfo: {
        title,
        category,
        startDate,
        endDate,
        location: {
          placeName,
          address,
          state,
          coordinates: [latitude, longitude],
        },
        description,
      },
      cover: {
        secure_url,
        public_id,
      },
    });
    return await event.save();
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number;
    return 500;
  }
};

eventSchema.statics.regUser = async function regUser(req: Request) {
  const { event } = req.params;
  try {
    await this.findByIdAndUpdate(event, { $addToSet: { registeredUser: tokenUserId(req) } });
    return (await this.findById(event)) as EventInter;
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number;
    return 500;
  }
};

eventSchema.statics.getAll = async function getAll() {
  try {
    return await this.find()
      .populate('registeredUser', 'userInfo.avatar.secure_url')
      .sort({ 'eventInfo.startDate': 1 })
      .lean()
      .exec();
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number;
    return 500;
  }
};

eventSchema.statics.getFiltered = async function getFiltered(req) {
  try {
    const { category, location, startDate, endDate, title, distance, latestFirst, latitude, longitude } = req.query;
    const filters: EventFilters = {};
    const searchLocation: SearchLocation = {};

    if (category) filters['eventInfo.category'] = category;

    if (location === 'user') {
      const user: UserInter | null = await User.findById(tokenUserId(req));
      if (user && user.userInfo.defaultLocation.coordinates) {
        searchLocation.type = 'Point';
        searchLocation.coordinates = user.userInfo.defaultLocation.coordinates;
      }
    } else if (latitude && longitude) {
      searchLocation.type = 'Point';
      searchLocation.coordinates = [Number(latitude), Number(longitude)];
    }

    if (startDate && endDate) {
      filters['eventInfo.startDate'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate === 'today') {
      filters['eventInfo.startDate'] = { $gte: new Date(), $lte: getEndOfDay(new Date().toISOString()) };
    } else if (startDate === 'tomorrow') {
      const tomorrow = getStartOfTomorrow();
      filters['eventInfo.startDate'] = { $gte: tomorrow, $lte: getEndOfDay(tomorrow.toISOString()) };
    } else if (startDate === 'available') {
      filters['eventInfo.startDate'] = { $gte: new Date() };
    }

    if (title) filters['eventInfo.title'] = new RegExp(title, 'i');

    const sortFor: string | Record<string, SortOrder> = latestFirst ? { createdAt: -1 } : { 'eventInfo.startDate': 1 };
    console.log(searchLocation);
    const query = this.find(filters).sort(sortFor);

    if (searchLocation.coordinates && distance) {
      query.where('eventInfo.location.coordinates').near({
        center: {
          type: 'Point',
          coordinates: searchLocation.coordinates,
        },
        maxDistance: Number(distance) * 1000,
      });
    }

    if (Object.keys(filters).length === 0 && Object.keys(searchLocation).length === 0)
      throw new Error('No filters selected');
    return await query.exec();
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number;
    return 500;
  }
};

eventSchema.statics.getOne = async function getOne(req) {
  const { event } = req.params;
  try {
    return await this.findById(event)
      .populate('registeredUser', 'userInfo.avatar.secure_url organizer')
      .populate('organizer', 'userInfo.firstName userInfo.lastName userInfo.avatar.secure_url')
      .exec();
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number;
    return 500;
  }
};

const Event = mongoose.model<EventInter, EventFuncInter>('Event', eventSchema);

export default Event;
