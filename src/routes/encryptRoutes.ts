import express from 'express';
import { loginUser, registerUser } from '../controller/userController';
import registerUserSchema from '../validator/userSchema';

const encryptRoutes = express.Router();

encryptRoutes.post('/login', loginUser);
encryptRoutes.post('/register', registerUserSchema, registerUser);

export default encryptRoutes;
