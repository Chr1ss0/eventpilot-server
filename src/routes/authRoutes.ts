import express from 'express';
import testFunc from '../controller/userController';

const authRoutes = express.Router();

authRoutes.get('/', testFunc);

export default authRoutes;
