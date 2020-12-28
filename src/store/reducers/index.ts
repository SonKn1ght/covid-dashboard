import { defaultState, popupReducer } from '@store';
import { api } from '@api';
import { countriesReducer } from './countries-reducer';
import { covidReducer } from './covid-reducer';
import { selectedOptionsReducer } from './selected-options-reducer';
import { searchReducer } from './search-reducer';
import { fullScreenElementReducer } from './full-screen-element-reducer';
import { AppActions, IAppState } from '@types';
import { AnyAction } from 'redux';

export function rootReducer(state: IAppState = defaultState, action: AnyAction) {
  const { DISEASE, RESTCOUNTRIES } = api.endpoints;
  api.setCovidDataSource(DISEASE);
  api.setCountriesDataSource(RESTCOUNTRIES);

  switch (action.type) {
    case AppActions.SET_COUNTRIES:
    case AppActions.SET_ACTIVE_COUNTRY:
    case AppActions.SET_COUNTRY_COVID_DATA:
      return countriesReducer(state, action);
    case AppActions.SET_COVID_DATA:
    case AppActions.SET_GLOBAL_COVID_DATA:
      return covidReducer(state, action);
    case AppActions.SET_TIME_INTERVAL:
    case AppActions.SET_ACTIVE_STATUS:
    case AppActions.SET_SIZE_STATS:
      return selectedOptionsReducer(state, action);
    case AppActions.SET_SEARCH_VALUE:
      return searchReducer(state, action);
    case AppActions.SET_FULL_SCREEN:
      return fullScreenElementReducer(state, action);
    case AppActions.SEP_POPUP_STATUS:
      return popupReducer(state, action);
    default:
      return state;
  }
}

export * from './countries-reducer';
export * from './covid-reducer';
export * from './selected-options-reducer';
export * from './search-reducer';
export * from './full-screen-element-reducer';
export * from './popup-reducer';
