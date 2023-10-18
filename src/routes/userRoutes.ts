import express from 'express';
import {
  // addReview,
  bookmarkEvent,
  // editUser,
  // followUser,
  getUser,
  validateUser,
} from '../controller/userController';

const userRoutes = express.Router();

userRoutes.get('/validate', validateUser);
userRoutes.get('/data', getUser);

// userRoutes.post('/review', addReview);
userRoutes.post('/bookmark/:event', bookmarkEvent);
// userRoutes.post('/follow/:user', followUser);
//
// userRoutes.put('edit', editUser);
//
// userRoutes.patch('update/:field', editUser);
//
export default userRoutes;
