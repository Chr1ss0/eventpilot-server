import express from 'express';
import multer from 'multer';
import {
  addReview,
  bookmarkEvent,
  patchUser,
  editUser,
  getUser,
  validateUser,
  followUser,
  logoutUser,
  getUserId,
} from '../controller/userController';

const upload = multer({ storage: multer.memoryStorage() });

const userRoutes = express.Router();

userRoutes.get('/validate', validateUser);
userRoutes.get('/data', getUser);
userRoutes.get('/data/:userId', getUserId);
userRoutes.get('/logout', logoutUser);

userRoutes.post('/review', addReview);
userRoutes.post('/bookmark/:event', bookmarkEvent);
userRoutes.post('/follow/:idFollowing', followUser);

userRoutes.put('edit', upload.single('image'), editUser);

userRoutes.patch('/location', patchUser);

export default userRoutes;
