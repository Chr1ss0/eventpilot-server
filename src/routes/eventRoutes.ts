import express from 'express';
import multer from 'multer';
import eventValidateSchema from '../validator/eventSchema';
import { createEvent, getAllEvents, getOneEvent, registerUserToEvent } from '../controller/eventController';

const upload = multer({ storage: multer.memoryStorage() });

const eventRoutes = express.Router();

eventRoutes.get('/all', getAllEvents);
eventRoutes.get('/single/:event', getOneEvent);
// eventRoutes.get('/filtered/:query', getFilteredEvents);

eventRoutes.post('/create', upload.single('image'), eventValidateSchema, createEvent);
eventRoutes.post('/register/:event', registerUserToEvent);

export default eventRoutes;
