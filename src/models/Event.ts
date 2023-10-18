import mongoose from 'mongoose';
import { Request } from 'express';
import { EventFuncInter, EventInter } from '../shared/types/eventTypes';
import { CustomErrType } from '../shared/types/sharedTypes';

const eventSchema = new mongoose.Schema<EventInter, EventFuncInter>({
  organizer: {
    type: String,
    required: true,
  },
  eventInfo: {
    title: {
      type: String,
      unique: true,
    },
    category: {
      type: String,
      enum: ['Sports', 'Music', 'Art', 'Food'],
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
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  cover: [
    {
      secure_url: {
        type: String,
        default:
          'https://images.unsplash.com/photo-1594322436404-5a0526db4d13?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2629&q=80',
      },
      public_id: {
        type: String,
      },
    },
  ],
  registeredUser: [
    {
      _id: {
        type: String,
      },
      secure_url: {
        type: String,
      },
    },
  ],
});

eventSchema.statics.createNew = async function createNew(req: Request): Promise<EventInter | number> {
  const { organizer, title, category, startDate, endDate, location, description } = req.body;
  const event = new this({
    organizer,
    eventInfo: {
      title,
      category,
      startDate,
      endDate,
      location,
      description,
    },
  });
  try {
    await event.save();
    return event;
  } catch (error: CustomErrType | unknown) {
    console.log(error);
    if (typeof error === 'object' && error !== null && 'code' in error) return error.code as number;
    return 500;
  }
};

const EventItem = mongoose.model<EventInter, EventFuncInter>('Event', eventSchema);

export default EventItem;
