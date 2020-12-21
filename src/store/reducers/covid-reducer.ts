import { Dispatch } from 'redux';
import { defaultState } from '@store';
import { ICountry, AppActions, IFetchResult } from '@types';
import { storage } from '@utils';
import { api } from '@api';

export function covidReducer(state = defaultState, action: any) {
  const { payload, type } = action;
  switch (type) {
    case AppActions.SET_COVID_DATA:
      let covidAllCountries = state.covidAllCountries;
      let covidGlobal = state.covidGlobal;
      let validCountries: Array<ICountry> = state.countries;

      if (payload.isFetch && !payload.isError) {
        covidAllCountries = payload.data.covidAllCountries;
        validCountries = payload.data.validCountries;
        covidGlobal = payload.data.covidGlobal;
      }

      if (payload.isFetch && payload.isError) {
        covidGlobal = null;
      }

      if (!payload.isFetch) {
        covidAllCountries = payload.data;
        covidGlobal = storage.covidGlobal.get();
      }

      let covidActive: any = state.covidActive;
      if (!state.selectedCountry) {
        covidActive = covidGlobal;
      }

      return {
        ...state,
        isCovidLoaded: true,
        covidAllCountries,
        covidGlobal,
        covidActive,
        countries: validCountries,
      };

    case AppActions.SET_GLOBAL_COVID_DATA:
      let globalCovidData = state.globalCovidData;

      if (payload.isFetch && !payload.isError) {
        globalCovidData = payload.data;
      }

      if (payload.isFetch && payload.isError) {
        globalCovidData = null;
      }

      return {
        ...state,
        isGlobalCovidDataLoaded: true,
        isCountryCovidDataLoaded: true,
        globalCovidData,
        selectedData: globalCovidData,
      };

    default:
      return state;
  }
}

export const loadCovidInfo = (countries: any) => (dispatch: Dispatch) => {
  const now = new Date();
  const hours = now.getUTCHours();
  const prev = new Date(+storage.lastFetchDate.get());
  const isPrevDay = prev.getUTCDate() !== now.getUTCDate();
  const isPrevHours = prev.getUTCHours() < hours;
  const isNewTime = hours >= 8 && (isPrevDay || isPrevHours);

  if (!storage.covidData.has() || isNewTime) {
    api.fetchCovidSummaryData(
      AppActions.SET_COVID_DATA,
      (result: IFetchResult) => {
        dispatch(result);
      },
      (error: IFetchResult) => dispatch(error),
      { countries }
    );
  } else {
    dispatch({
      type: AppActions.SET_COVID_DATA,
      payload: {
        isFetch: false,
        isError: true,
        data: storage.covidData.get(),
      },
    });
  }
};

export const loadGlobalCovidData = (countries?: any) => (
  dispatch: Dispatch
) => {
  api.fetchCovidGlobalData(
    AppActions.SET_GLOBAL_COVID_DATA,
    (result: IFetchResult) => {
      dispatch(result);
    },
    (error: IFetchResult) => dispatch(error),
    { countries }
  );
};
