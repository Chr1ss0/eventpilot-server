import axios, { AxiosResponse } from 'axios';

export type LocationDataType = {
  'place name': string;
  longitude: string;
  state: string;
  'state abbreviation': string;
  latitude: string;
};

interface ZipDataInter extends AxiosResponse {
  places: LocationDataType[];
}

async function getZipDataArray(zipCode: string): Promise<'No valid ZipCode' | LocationDataType[]> {
  const url = `https://api.zippopotam.us/de/${zipCode}`;

  try {
    const result: ZipDataInter = await axios.get(url);
    return result.data.places;
  } catch (error) {
    console.log(error);
    return 'No valid ZipCode';
  }
}

export async function getZipData(zipCode: string) {
  const setDefaultLocation = await getZipDataArray(zipCode);
  if (setDefaultLocation === 'No valid ZipCode') throw new Error('Get ZipCode Data failed.');
  const { latitude, longitude, state, 'place name': placeName }: LocationDataType = setDefaultLocation[0];
  return {
    latitude,
    longitude,
    state,
    placeName,
  };
}

export default getZipDataArray;
