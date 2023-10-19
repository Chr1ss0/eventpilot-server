import express from 'express';
import { loginUser, registerUser } from '../controller/userController';

const encryptRoutes = express.Router();

encryptRoutes.post('/login', loginUser);
// encryptRoutes.post('/logut', logoutUser);
encryptRoutes.post('/register', registerUser);

export default encryptRoutes;
