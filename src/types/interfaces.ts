export interface ICountry {
  population: number;
  flag: string;
  name: string;
  alpha2Code: string;
}

export interface ICovidCase {
  confirmed: number;
  deaths: number;
  recovered: number;
}

export interface ICovidInfo {
  population?: number;
  total: ICovidCase;
  totalPer100: ICovidCase;
  lastDay: ICovidCase;
  lastDayPer100: ICovidCase;
}

export interface ICountryCovidItem {
  Country?: string /** {@link ICountry.name} */;
  CountryCode?: string;
  Province?: string;
  City?: string;
  CityCode?: string;
  Lat?: string;
  Lon?: string;
  Confirmed: number;
  Deaths: number;
  Recovered: number;
  ConfirmedPer100?: number;
  DeathsPer100?: number;
  RecoveredPer100?: number;
  NewConfirmed?: number;
  NewDeaths?: number;
  NewRecovered?: number;
  NewConfirmedPer100?: number;
  NewDeathsPer100?: number;
  NewRecoveredPer100?: number;
  Active?: number;
  Date: string | Date;
}

export interface ISelectedOptions {
  timeInterval: string;
  activeStatus: string;
  sizeStats: string;
}

export interface IAppState {
  isCountriesLoaded: boolean;
  isCovidLoaded: boolean;
  isCovidFailed: boolean;
  isGlobalCovidDataLoaded: boolean;
  isCountryCovidDataLoaded: boolean;
  isCountryCovidDataFailed: boolean;
  countries: Array<ICountry>;
  selectedCountry: string | null;
  covidActive: ICovidInfo | null;
  covidGlobal: ICovidInfo | null;
  covidAllCountries: {
    [key: string]: ICovidInfo;
  };
  globalCovidData: ICountryCovidItem[] | null;
  selectedData: ICountryCovidItem[] | null;
  selectedOptions: ISelectedOptions;
  searchValue: string;
  intensivity: ICovidInfo | null;
  fullScreenElement: boolean;
  popup: boolean;
}

export interface IAppComponentProps {
  isCountriesLoaded: boolean;
  isCovidLoaded: boolean;
  isGlobalCovidDataLoaded: boolean;
  countries: Array<ICountry>;
  loadCountries: () => void;
  loadCovidInfo: (countries: Array<ICountry>) => void;
  loadGlobalCovidData: (countries: Array<ICountry>) => void;
}

export interface IFetchResult {
  type: string;
  payload: {
    isFetch: boolean;
    isError: boolean;
    data: object | string | [];
  };
}

export interface IApiEndpoint {
  url: string;
  params?: object;
  handler?: (data: any, addData?: any) => void;
}

export interface IApiSource {
  [endpoint: string]: IApiEndpoint;
}

export interface IColorChart {
  Confirmed: string;
  Deaths: string;
  Recovered: string;
  ConfirmedPer100: string;
  DeathsPer100: string;
  RecoveredPer100: string;
  NewConfirmed: string;
  NewDeaths: string;
  NewRecovered: string;
  NewConfirmedPer100: string;
  NewDeathsPer100: string;
  NewRecoveredPer100: string;
}

export interface ICountryForRender {
  name: string;
  flag: string;
  alpha2Code: string;
  stats?: number;
  status?: string;
}
