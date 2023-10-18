import express from 'express';
import { registerUser } from '../controller/userController';

const encryptRoutes = express.Router();

encryptRoutes.post('/login', registerUser);
encryptRoutes.post('/register', registerUser);

export default encryptRoutes;
