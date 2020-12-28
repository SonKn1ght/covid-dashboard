import { ICountryCovidItem, ICovidInfo } from '@types';

export type TPayloadData = ICountryCovidItem[] | string | Error;

export type TGlobalCovidInfo = {
  [key: string]: ICovidInfo;
};
