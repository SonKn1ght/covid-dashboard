import { IAppState } from '@types';

export const defaultState: IAppState = {
  isCountriesLoaded: false,
  isCovidLoaded: false,
  isGlobalCovidDataLoaded: false,
  isCountryCovidDataLoaded: false,
  countries: [],
  selectedCountry: null,
  covidActive: null,
  covidGlobal: null,
  covidAllCountries: {},
  globalCovidData: [],
  selectedData: [],
  selectedOptions: {
    timeInterval: 'all',
    activeStatus: 'confirmed',
    sizeStats: 'all',
  },
  searchValue: '',
  intensivity: null,
  fullScreenElement: false,
  isCountryCovidDataFailed: false,
  isCovidFailed: false,
  popup: false,
};
