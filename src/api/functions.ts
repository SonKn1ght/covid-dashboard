import { TGlobalCovidInfo } from '@api';
import { ICountry } from '@types';

interface IIntensivityCase {
  confirmed: Array<number>;
  deaths: Array<number>;
  recovered: Array<number>;
}

interface IIntensivity {
  total: IIntensivityCase;
  totalPer100: IIntensivityCase;
  lastDay: IIntensivityCase;
  lastDayPer100: IIntensivityCase;
}

export const calcPer100 = (
  population: number,
  confirmed: number,
  deaths: number,
  recovered: number
) => {
  const per100 = 100000;
  return {
    confirmed: Math.floor((per100 * confirmed) / population),
    deaths: Math.floor((per100 * deaths) / population),
    recovered: Math.floor((per100 * recovered) / population),
  };
};

export function calcEarthPopulation(countries: any) {
  return countries.reduce((sum: number, country: any) => {
    return sum + country.population;
  }, 0);
}

export function getCoutriesSameFromCovid(
  covidAllCountries: TGlobalCovidInfo,
  countries: ICountry[]
) {
  return countries.filter((country: ICountry) => {
    return covidAllCountries[country.alpha2Code.toUpperCase()] !== undefined;
  });
}

export function getIntensivity(covidAllCountries: TGlobalCovidInfo) {
  const max = Number.MAX_SAFE_INTEGER;
  const init: IIntensivityCase = {
    confirmed: [max, 0],
    deaths: [max, 0],
    recovered: [max, 0],
  };

  let intensivity: IIntensivity = {
    total: { ...init },
    totalPer100: { ...init },
    lastDay: { ...init },
    lastDayPer100: { ...init },
  };

  Object.keys(covidAllCountries).forEach((key) => {
    const country = covidAllCountries[key];
    intensivity.total = compare(intensivity.total, country.total);
    intensivity.totalPer100 = compare(intensivity.totalPer100, country.totalPer100);
    intensivity.lastDay = compare(intensivity.lastDay, country.lastDay);
    intensivity.lastDayPer100 = compare(intensivity.lastDayPer100, country.lastDayPer100);
  });

  const RANGE_SIZE = 5;

  intensivity = rangeIntensivity(RANGE_SIZE, { ...intensivity });

  return intensivity;
}

function compareFields(field1: any, field2: any) {
  const field = field1.slice();

  if (field2 < field1[0]) {
    field[0] = field2;
  }

  if (field2 > field1[1]) {
    field[1] = field2;
  }
  return field;
}

function compare(object1: any, object2: any) {
  const result = { ...object1 };

  result.confirmed = compareFields(object1.confirmed, object2.confirmed);
  result.deaths = compareFields(object1.deaths, object2.deaths);
  result.recovered = compareFields(object1.recovered, object2.recovered);

  return result;
}

function getRangeByBounds(size: number, bounds: Array<number>) {
  const [min, max] = bounds;
  const step = Math.abs(Math.round((max - min) / size));

  return Array(size)
    .fill(0)
    .map((_, idx) => min + idx * step);
}

function range(size: number, obj: IIntensivityCase): IIntensivityCase {
  const rangeObject: IIntensivityCase = {
    confirmed: getRangeByBounds(size, obj.confirmed),
    deaths: getRangeByBounds(size, obj.deaths),
    recovered: getRangeByBounds(size, obj.recovered),
  };

  return rangeObject;
}

function rangeIntensivity(size: number, intensivity: IIntensivity): IIntensivity {
  const obj = {
    total: range(size, intensivity.total),
    totalPer100: range(size, intensivity.totalPer100),
    lastDay: range(size, intensivity.lastDay),
    lastDayPer100: range(size, intensivity.lastDayPer100),
  };

  return obj;
}
