import mongoose from 'mongoose';
import { Request } from 'express';
import { EventFilters, EventFuncInter, EventInter } from '../shared/types/eventTypes';
import { CustomErrType, SearchLocation } from '../shared/types/sharedTypes';
import { tokenUserId } from '../utils/token';
import { getZipData } from '../utils/geoHelper';
import { uploadImage } from '../utils/imageService';
import { UserInter } from '../shared/types/userTypes';

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
      default:
        'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2629&q=80',
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
    const { title, category, startDate, endDate, description, location } = req.body;
    const [zipCode, address] = location.split(',');
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const { secure_url, public_id } = await uploadImage(req.file.buffer);
    const { placeName, state, latitude, longitude } = await getZipData(zipCode.trim());
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
    await event.save();
    return event;
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number;
    return 500;
  }
};

eventSchema.statics.regUser = async function regUser(req: Request) {
  const userId = tokenUserId(req);
  const { event } = req.params;

  try {
    await this.findByIdAndUpdate(event, { $addToSet: { registeredUser: userId } });
    return (await this.findById(event)) as EventInter;
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number;
    return 500;
  }
};

eventSchema.statics.getAll = async function getAll() {
  try {
    return await this.find().populate('registeredUser', 'userInfo.avatar.secure_url').lean().exec();
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number;
    return 500;
  }
};

eventSchema.statics.getFiltered = async function getFiltered(req) {
  try {
    const filters: EventFilters = {};
    const searchLocation: SearchLocation = {};
    if (req.query.category) filters.category = req.query.category;
    if (typeof req.query.location === 'boolean') {
      const userId = tokenUserId(req);
      const user: UserInter | null = await this.findById(userId);
      if (!user) throw new Error('No User found');
      searchLocation.type = 'Point';
      searchLocation.coordinates = user.userInfo.defaultLocation.coordinates;
    } else if (req.query.location) {
      const locationData = await getZipData(req.query.search);
      searchLocation.type = 'Point';
      searchLocation.coordinates = [Number(locationData.longitude), Number(locationData.latitude)];
    }
    if (req.query.date) filters.date = req.query.date;
    if (req.query.title) {
      filters.title = new RegExp(req.query.title, 'i');
    }

    const query = this.find(filters);

    if (searchLocation.coordinates && req.query.distance) {
      query.where('location').near({
        center: {
          type: 'Point',
          coordinates: searchLocation.coordinates,
        },
        maxDistance: req.query.distance,
      });
    }

    console.log(filters);

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
