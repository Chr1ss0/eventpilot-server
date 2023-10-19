import express from 'express';
import {
  addReview,
  // addReview,
  bookmarkEvent,
  patchUser,
  // editUser,
  // followUser,
  getUser,
  validateUser,
  followUser,
} from '../controller/userController';

const userRoutes = express.Router();

userRoutes.get('/validate', validateUser);
userRoutes.get('/data', getUser);

userRoutes.post('/review', addReview);
userRoutes.post('/bookmark/:event', bookmarkEvent);
userRoutes.post('/follow/:idFollowing', followUser);

// userRoutes.put('edit', editUser);

userRoutes.patch('/update', patchUser);

export default userRoutes;
