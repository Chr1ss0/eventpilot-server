import express from 'express';
import getLocations from '../controller/utilityController';

const utilityRoutes = express.Router();

utilityRoutes.get('/location/:zipCode', getLocations);

export default utilityRoutes;
