// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from 'mongoose';
import express from 'express';

export const app = express();

const { MONGO_URI, PORT } = process.env;

export async function startServer() {
  try {
    if (!MONGO_URI || typeof MONGO_URI !== 'string')
      throw new Error('MONGO_URI is not undefined or not of type String');
    await mongoose.connect(MONGO_URI);
    app.listen(PORT, () => console.log(`Port in use: ${PORT}`));
  } catch (error) {
    console.error(error);
  }
}
