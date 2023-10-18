import express from 'express';
import createEvent from '../controller/eventController';
import eventValidateSchema from '../validator/eventSchema';

const eventRoutes = express.Router();

// eventRoutes.get('/all', getAllEvents);
// eventRoutes.get('/filtered/:query', getFilteredEvents);

eventRoutes.post('/create', eventValidateSchema, createEvent);
// eventRoutes.post('/register', registerUserToEvent);

export default eventRoutes;
