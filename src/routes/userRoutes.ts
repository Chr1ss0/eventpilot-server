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
import updateUserSchema from '../validator/updateUserSchema';

const upload = multer({ storage: multer.memoryStorage() });

const userRoutes = express.Router();

userRoutes.get('/validate', validateUser);
userRoutes.get('/all', getUser);
userRoutes.get('/single/:postUser', getUserId);
userRoutes.get('/logout', logoutUser);

userRoutes.post('/review', addReview);
userRoutes.post('/bookmark/:event', bookmarkEvent);
userRoutes.post('/follow/:followingId', followUser);

userRoutes.put('/edit', upload.single('image'), updateUserSchema, editUser);

userRoutes.patch('/location', patchUser);

export default userRoutes;
