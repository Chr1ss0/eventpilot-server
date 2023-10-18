import express from 'express';
import createEvent from '../controller/eventController';

const eventRoutes = express.Router();

// eventRoutes.get('/all', getAllEvents);
// eventRoutes.get('/filtered/:query', getFilteredEvents);

eventRoutes.post('/create', createEvent);
// eventRoutes.post('/register', registerUserToEvent);

export default eventRoutes;
