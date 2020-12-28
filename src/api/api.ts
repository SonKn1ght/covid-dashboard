import { IApiEndpoint, IApiSource, IFetchResult } from '@types';
import * as endpoints from './endpoints';
import axios from './axios';
import { TPayloadData } from '@api';

export let covidDataSource: IApiSource = endpoints.DISEASE;
export let countriesDataSource: IApiSource = endpoints.RESTCOUNTRIES;

type TFetchCallback = (result: IFetchResult) => void;

interface IParamsCountry {
  country: string | null;
  population: number;
}

function getResultObject(action: string, isError: boolean, data: TPayloadData): IFetchResult {
  return {
    type: action,
    payload: {
      isFetch: true,
      isError: isError,
      data,
    },
  };
}

async function fetchData(
  action: string,
  endpoint: IApiEndpoint,
  resolve: TFetchCallback,
  reject: TFetchCallback,
  params: Object = {},
  addUrl = ''
) {
  endpoint.params = params;

  try {
    const apiData = await axios.get(addUrl || endpoint.url);
    let data = apiData.data;

    if (covidDataSource === endpoints.DISEASE && endpoint === endpoints.DISEASE.summary) {
      const globalData = await axios.get(endpoints.DISEASE.globalSummary.url);
      data = endpoint.handler ? endpoint.handler(data, globalData.data) : data;
    } else {
      data = endpoint.handler ? endpoint.handler(data) : data;
    }

    resolve(getResultObject(action, false, data));
  } catch (error) {
    reject(getResultObject(action, true, error));
  }
}

export function fetchCountries(action: string, resolve: TFetchCallback, reject: TFetchCallback) {
  fetchData(action, countriesDataSource.countries, resolve, reject);
}

export function fetchCovidGlobalData(
  action: string,
  resolve: TFetchCallback,
  reject: TFetchCallback,
  params: Object = {}
) {
  fetchData(action, covidDataSource.globalData, resolve, reject, params);
}

export function fetchCovidSummaryData(
  action: string,
  resolve: TFetchCallback,
  reject: TFetchCallback,
  params: Object = {}
) {
  fetchData(action, covidDataSource.summary, resolve, reject, params);
}

export function fetchCovidCountryData(
  action: string,
  resolve: TFetchCallback,
  reject: TFetchCallback,
  params: IParamsCountry
) {
  if (!params.country) {
    return;
  }

  const addUrl = covidDataSource.country.url.replace('{country}', params.country);
  fetchData(action, covidDataSource.country, resolve, reject, params, addUrl);
}

export function setCovidDataSource(source: IApiSource) {
  covidDataSource = source;
}

export function setCountriesDataSource(source: IApiSource) {
  countriesDataSource = source;
}

export * as endpoints from './endpoints';
