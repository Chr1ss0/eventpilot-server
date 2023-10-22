import { Request, Response } from 'express';
import getZipDataArray from '../utils/geoHelper';
import { notAcceptedError } from '../utils/errorHandlers';

async function getLocations(req: Request, res: Response) {
  const { zipCode } = req.params;
  const locations = await getZipDataArray(zipCode);
  if (locations === 'No valid ZipCode') return notAcceptedError(res, locations);
  return res.status(200).json(locations);
}

export default getLocations;
