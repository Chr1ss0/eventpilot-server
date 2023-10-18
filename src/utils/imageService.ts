// eslint-disable-next-line import/no-extraneous-dependencies
import cloudinary from 'cloudinary';
import * as util from 'util';
import { CloudinaryURLT } from '../shared/types/modelTypes';

export function uploadImage(buffer: Buffer): Promise<CloudinaryURLT> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader
      .upload_stream((error, result) => {
        if (error) reject(error);
        else resolve(result as CloudinaryURLT);
      })
      .end(buffer);
  });
}

const destroyAsync = util.promisify(cloudinary.v2.uploader.destroy);

export async function deleteImage(id: string) {
  return destroyAsync(id);
}
