import express from 'express';
import { loginUser, logoutUser, registerUser } from '../controller/userController';
import registerUserSchema from '../validator/userSchema';

const encryptRoutes = express.Router();

encryptRoutes.post('/login', loginUser);
encryptRoutes.post('/logout', registerUserSchema, logoutUser);
encryptRoutes.post('/register', registerUser);

export default encryptRoutes;
