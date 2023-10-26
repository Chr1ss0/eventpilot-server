export type CustomErrType = {
  code: number;
};

export type CloudUrlType = {
  secure_url: string;
  public_id: string;
};
export type LocationType = {
  placeName: string;
  address?: string;
  state: string;
  coordinates: number[];
};

export type GeoFilterObjType = {
  type?: string;
  coordinates?: string[] | number[];
};

export type SortObjType = {
  [key: string]: 'asc' | 'desc';
};
