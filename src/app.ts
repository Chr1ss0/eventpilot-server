import 'dotenv/config';
import express from 'express';
// eslint-disable-next-line import/no-extraneous-dependencies
import morgan from 'morgan';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/authRoutes';
import { startServer, app } from './utils/serverConfig';
import corsOption from './utils/corsConfig';

app.use(morgan('dev'));
app.use(cors(corsOption));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

(async () => {
  try {
    await startServer();
    console.log('Server is Online');
  } catch (error) {
    console.log(`Error while starting Server: ${error}`);
  }
})();
