import mongoose from 'mongoose';
import { Request } from 'express';

const Event = mongoose.model(
  'Event',
  new mongoose.Schema(
    {
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
            required: true,
          },
          secure_url: {
            type: String,
            required: true,
          },
        },
      ],
    },
    {
      statics: {
        async create(req: Request) {
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
          } catch (error) {
            console.log(error);
          }
        },
      },
    },
  ),
);

export default Event;
