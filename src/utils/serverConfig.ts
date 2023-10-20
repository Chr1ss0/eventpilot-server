// eslint-disable-next-line import/no-extraneous-dependencies
import mongoose from 'mongoose';
import express from 'express';

export const app = express();

const { MONGO_URI, PORT } = process.env;

// export async function startServer() {
//   try {
//     if (!MONGO_URI || typeof MONGO_URI !== 'string')
//       throw new Error('MONGO_URI is not undefined or not of type String');
//     await mongoose.connect(MONGO_URI);
//     app.listen(PORT, () => console.log(`Port in use: ${PORT}`));
//   } catch (error) {
//     console.error(error);
//   }
// }

const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

export async function startServer(retryCount = 0) {
  try {
    if (!MONGO_URI || typeof MONGO_URI !== 'string') {
      throw new Error('MONGO_URI is not defined or not of type String');
    }

    await mongoose.connect(MONGO_URI);
    app.listen(PORT, () => console.log(`Port in use: ${PORT}`));
  } catch (error) {
    console.error(error);
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying in ${RETRY_DELAY_MS / 1000} seconds...`);
      setTimeout(() => {
        startServer(retryCount + 1);
      }, RETRY_DELAY_MS);
    } else {
      console.error('Max retries reached. Server failed to start.');
    }
  }
}
