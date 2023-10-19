import express from 'express';
import eventValidateSchema from '../validator/eventSchema';
import { createEvent, getAllEvents, getOneEvent, registerUserToEvent } from '../controller/eventController';

const eventRoutes = express.Router();

eventRoutes.get('/all', getAllEvents);
eventRoutes.get('/single/:event', getOneEvent);
// eventRoutes.get('/filtered/:query', getFilteredEvents);

eventRoutes.post('/create', eventValidateSchema, createEvent);
eventRoutes.post('/register/:event', registerUserToEvent);

export default eventRoutes;
