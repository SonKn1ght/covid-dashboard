import { ICountry, ICovidInfo } from '@types';
import { func, storage } from '@utils';
import {
  getIntensivity,
  getCoutriesSameFromCovid,
  calcEarthPopulation,
  calcPer100,
  TGlobalCovidInfo,
} from '@api';

export interface IItem {
  [key: string]: number;
}

export interface IFetchGlobalItem {
  cases: IItem;
  deaths: IItem;
  recovered: IItem;
}

export interface ICountryData {
  country: string;
  province: string[];
  timeline: IFetchGlobalItem;
}

export interface ICountryInfo {
  _id?: number;
  iso2: string;
  iso3: string;
  lat: number;
  long: number;
  flag: string;
}

export interface ICountryItem {
  updated: number;
  country: string;
  countryInfo: ICountryInfo;
  cases: number;
  todayCases: number;
  deaths: number;
  todayDeaths: number;
  recovered: number;
  todayRecovered: number;
  active: number;
  critical: number;
  casesPerOneMillion: number;
  deathsPerOneMillion: number;
  tests: number;
  testsPerOneMillion: number;
  population: number;
  continent?: string;
  oneCasePerPeople: number;
  oneDeathPerPeople: number;
  oneTestPerPeople: number;
  activePerOneMillion: number;
  recoveredPerOneMillion: number;
  criticalPerOneMillion: number;
  affectedCountries?: number;
}

export const DISEASE = {
  globalData: {
    url: 'https://disease.sh/v3/covid-19/historical/all?lastdays=400',
    params: { countries: [] },
    handler: (data: IFetchGlobalItem) => globalDataHandler(data),
  },

  summary: {
    url: 'https://disease.sh/v3/covid-19/countries',
    params: { countries: [] },
    handler: (data: ICountryItem[], addData: ICountryItem) => summaryDataHandler(data, addData),
  },

  country: {
    url: 'https://disease.sh/v3/covid-19/historical/{country}?lastdays=400',
    params: { country: null, population: 0 },
    handler: (data: ICountryData) => countryDataHandler(data),
  },

  globalSummary: {
    url: 'https://disease.sh/v3/covid-19/all',
  },
};

function countryDataHandler(data: ICountryData) {
  const { population } = DISEASE.country.params;
  const selectedData = formatGlobalCovidData(population, data.timeline, data.country);

  return selectedData;
}

function globalDataHandler(data: IFetchGlobalItem) {
  const { countries } = DISEASE.globalData.params;
  let globalCovidData = null;
  let population = calcEarthPopulation(countries);
  globalCovidData = formatGlobalCovidData(population, data);
  return globalCovidData;
}

function summaryDataHandler(data: ICountryItem[], globalData: ICountryItem) {
  const { countries } = DISEASE.summary.params;
  let covidAllCountries: TGlobalCovidInfo = {};
  let intensivity = {};
  let covidGlobal: ICovidInfo | [] = [];
  let validCountries: ICountry[] = countries;

  const fetchDate = new Date().getTime().toString();
  const population = calcEarthPopulation(countries);

  covidAllCountries = formatDataFromFetch(countries, data);
  intensivity = getIntensivity(covidAllCountries);

  validCountries = getCoutriesSameFromCovid(covidAllCountries, countries);

  covidGlobal = formatGlobalFromFetch(population, globalData);

  storage.population.set(population);
  storage.countries.set(validCountries);
  storage.covidData.set(covidAllCountries);
  storage.covidGlobal.set(covidGlobal);
  storage.lastFetchDate.set(fetchDate);
  storage.intensivity.set(intensivity);

  return { covidAllCountries, validCountries, covidGlobal, intensivity };
}

function formatDataFromFetch(countries: ICountry[], data: ICountryItem[]): TGlobalCovidInfo | {} {
  const countriesObject = countries.reduce((acc: object, country: ICountry) => {
    return {
      ...acc,
      [country.alpha2Code.toUpperCase()]: country.population,
    };
  }, {});

  const covidData = data.reduce((acc: Object, country: ICountryItem) => {
    if (!countriesObject[country.countryInfo.iso2]) {
      return { ...acc };
    }

    const population = countriesObject[country.countryInfo.iso2];

    const countryObject = {
      [country.countryInfo.iso2]: createCovidInfoObject(population, country),
    };

    return {
      ...acc,
      ...countryObject,
    };
  }, {});

  return covidData;
}

function createCovidInfoObject(population: number, info: ICountryItem): ICovidInfo {
  const obj = {
    population,
    total: {
      confirmed: info.cases,
      deaths: info.deaths,
      recovered: info.recovered,
    },

    totalPer100: {
      confirmed: Math.round(info.casesPerOneMillion / 10),
      deaths: Math.round(info.deathsPerOneMillion / 10),
      recovered: Math.round(info.recoveredPerOneMillion / 10),
    },

    lastDay: {
      confirmed: info.todayCases,
      deaths: info.todayDeaths,
      recovered: info.todayRecovered,
    },

    lastDayPer100: calcPer100(population, info.todayCases, info.todayDeaths, info.todayRecovered),
  };

  return obj;
}

function getNew(prev: number | undefined, current: number) {
  if (!prev) {
    return current;
  }

  const diff = Math.abs(current - prev);

  return diff;
}

function formatGlobalCovidData(population: number, data: IFetchGlobalItem, country?: string) {
  const dates = Object.keys(data.cases);

  const result = dates.map((date, i) => {
    const lastDay = new Date(date);
    const prev = dates[i - 1] ? dates[i - 1] : 0;
    const newData = {
      NewConfirmed: getNew(data.cases[prev], data.cases[date]),
      NewDeaths: getNew(data.deaths[prev], data.deaths[date]),
      NewRecovered: getNew(data.recovered[prev], data.recovered[date]),
    };

    let dataCountry = {};
    if (country) {
      dataCountry = {
        Country: country,
      };
    }

    return {
      Confirmed: data.cases[date],
      Deaths: data.deaths[date],
      Recovered: data.recovered[date],
      ConfirmedPer100: func.calcPer100Thousand(population, data.cases[date]),
      DeathsPer100: func.calcPer100Thousand(population, data.deaths[date]),
      RecoveredPer100: func.calcPer100Thousand(population, data.recovered[date]),
      ...newData,
      NewConfirmedPer100: func.calcPer100Thousand(population, newData.NewConfirmed),
      NewDeathsPer100: func.calcPer100Thousand(population, newData.NewDeaths),
      NewRecoveredPer100: func.calcPer100Thousand(population, newData.NewRecovered),
      ...dataCountry,
      Date: lastDay,
    };
  });

  return result;
}

function formatGlobalFromFetch(population: number, global: ICountryItem) {
  return createCovidInfoObject(population, global);
}
