import mongoose from 'mongoose';
import { Request } from 'express';
import { FilterObjType, EventFuncInter, EventInter } from '../shared/types/eventTypes';
import { CustomErrType, GeoFilterObjType, SortObjType } from '../shared/types/sharedTypes';
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
      unique: true,
      type: String,
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

eventSchema.statics.getAll = async function getAll(req: Request) {
  const { sort } = req.query;
  console.log(sort);
  const sortObj: SortObjType = {};
  // eslint-disable-next-line no-underscore-dangle
  if (sort === 'createdfirst') sortObj._id = 'asc';
  // eslint-disable-next-line no-underscore-dangle
  else if (sort === 'createdlast') sortObj._id = 'desc';
  else sortObj['eventInfo.startDate'] = 'asc';
  try {
    return await this.find({ 'eventInfo.startDate': { $gte: new Date() } })
      .limit(50)
      .populate('registeredUser', 'userInfo.avatar.secure_url')
      .sort(sortObj)
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
    const { category, location, startDate, endDate, title, distance, sort, latitude, longitude } = req.query;
    console.log(req.query);
    const filterObj: FilterObjType = {};
    const geoFilterObj: GeoFilterObjType = {};
    const sortObj: SortObjType = {};
    // eslint-disable-next-line no-underscore-dangle
    if (sort === 'createdfirst') sortObj._id = 'asc';
    // eslint-disable-next-line no-underscore-dangle
    else if (sort === 'createdlast') sortObj._id = 'desc';
    else sortObj['eventInfo.startDate'] = 'asc';

    if (category) filterObj['eventInfo.category'] = category;

    if (location === 'user') {
      const user: UserInter | null = await User.findById(tokenUserId(req));
      if (user && user.userInfo.defaultLocation.coordinates) {
        geoFilterObj.type = 'Point';
        geoFilterObj.coordinates = user.userInfo.defaultLocation.coordinates;
      }
    } else if (latitude && longitude) {
      geoFilterObj.type = 'Point';
      geoFilterObj.coordinates = [Number(latitude), Number(longitude)];
    }

    if (startDate && endDate) {
      filterObj['eventInfo.startDate'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
    } else if (startDate === 'today') {
      filterObj['eventInfo.startDate'] = { $gte: new Date(), $lte: getEndOfDay(new Date().toISOString()) };
    } else if (startDate === 'tomorrow') {
      const tomorrow = getStartOfTomorrow();
      filterObj['eventInfo.startDate'] = { $gte: tomorrow, $lte: getEndOfDay(tomorrow.toISOString()) };
    } else if (startDate === 'available') {
      filterObj['eventInfo.startDate'] = { $gte: new Date() };
    }

    if (title) filterObj['eventInfo.title'] = new RegExp(title, 'i');

    const query = this.find(filterObj).sort(sortObj);

    if (geoFilterObj.coordinates && distance) {
      query.where('eventInfo.location.coordinates').near({
        center: {
          type: 'Point',
          coordinates: geoFilterObj.coordinates,
        },
        maxDistance: Number(distance) * 1000,
      });
    }

    console.log(`FilerObj:`, filterObj, `geoObj;`, geoFilterObj);

    if (Object.keys(filterObj).length === 0 && Object.keys(geoFilterObj).length === 0)
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
