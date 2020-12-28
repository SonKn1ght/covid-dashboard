import { LocalStorageKeys as Keys } from '@types';

export const population = createStorageObject(Keys.EARTH_POPULATION);
export const countries = createStorageObject(Keys.COUNTRIES);
export const lastFetchDate = createStorageObject(Keys.LAST_FETCH_DATE);
export const covidData = createStorageObject(Keys.COVID_DATA);
export const covidGlobal = createStorageObject(Keys.COVID_GLOBAL);
export const globalCovidData = createStorageObject(Keys.GLOBAL_COVID_DATA);
export const intensivity = createStorageObject(Keys.INTENSIVITY);

function createStorageObject(key: string) {
  return {
    set(value: any) {
      localStorage.setItem(key, JSON.stringify(value));
    },

    get() {
      const value: any = localStorage.getItem(key);
      return JSON.parse(value);
    },

    has() {
      return localStorage.getItem(key) !== null;
    },
  };
}
