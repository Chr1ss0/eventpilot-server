import 'dotenv/config';
import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import multer from 'multer';
import encryptRoutes from './routes/encryptRoutes';
import { startServer, app } from './utils/serverConfig';
import corsOption from './utils/corsConfig';
import eventRoutes from './routes/eventRoutes';
import userRoutes from './routes/userRoutes';
import encrypt from './middleware/encryptMiddleware';
import auth from './middleware/authMiddleware';

const upload = multer();

app.use(morgan('dev'));
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', upload.none(), encrypt, encryptRoutes);
app.use('/api/event', upload.none(), auth, eventRoutes);
app.use('/api/user', auth, userRoutes);

(async () => {
  try {
    await startServer();
    console.log('Server is Online');
  } catch (error) {
    console.log(`Error while starting Server: ${error}`);
  }
})();
