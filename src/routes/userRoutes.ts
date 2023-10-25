import express from 'express';
import multer from 'multer';
import {
  addReview,
  bookmarkEvent,
  editUser,
  getUser,
  validateUser,
  followUser,
  logoutUser,
  getUserId,
  getWatchList,
} from '../controller/userController';
import updateUserSchema from '../validator/updateUserSchema';

const upload = multer({ storage: multer.memoryStorage() });

const userRoutes = express.Router();

userRoutes.get('/validate', validateUser);
userRoutes.get('/data', getUser);
userRoutes.get('/single/:userId', getUserId);
userRoutes.get('/logout', logoutUser);
userRoutes.get('/watchList', getWatchList);

userRoutes.post('/review', addReview);
userRoutes.post('/bookmark/:event', bookmarkEvent);
userRoutes.post('/follow/:followingId', followUser);

userRoutes.put('/edit', upload.single('image'), updateUserSchema, editUser);

export default userRoutes;
