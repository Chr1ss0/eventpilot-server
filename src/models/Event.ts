import mongoose from 'mongoose';
import { Request } from 'express';
import { EventFuncInter, EventInter } from '../shared/types/eventTypes';
import { CustomErrType } from '../shared/types/sharedTypes';
import { tokenUserId } from '../utils/token';
import { getZipData } from '../utils/geoHelper';
import { uploadImage } from '../utils/imageService';

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
    console.log(location);
    const [zipCode, address] = location.split(',');
    console.log(zipCode);
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
