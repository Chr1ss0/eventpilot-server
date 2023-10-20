import { Request, Response } from 'express';
import getZipDataArray from '../utils/geoHelper';

async function getLocations(req: Request, res: Response) {
  const { zipCode } = req.params;
  const locations = await getZipDataArray(zipCode);
  res.status(200).json(locations);
}

export default getLocations;
