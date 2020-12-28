import { AnyAction, Dispatch } from 'redux';
import { AppActions, IAppState } from '@types';

export function selectedOptionsReducer(state: IAppState, action: AnyAction) {
  const { payload, type } = action;
  let selectedOptions = state.selectedOptions;
  switch (type) {
    case AppActions.SET_TIME_INTERVAL:
      selectedOptions = { ...selectedOptions, timeInterval: payload };
      return {
        ...state,
        selectedOptions,
      };
    case AppActions.SET_ACTIVE_STATUS:
      selectedOptions = { ...selectedOptions, activeStatus: payload };
      return {
        ...state,
        selectedOptions,
      };
    case AppActions.SET_SIZE_STATS:
      selectedOptions = { ...selectedOptions, sizeStats: payload };
      return {
        ...state,
        selectedOptions,
      };
    default:
      return state;
  }
}

export const setActiveTimeInterval = (payload: string) => (
  dispatch: Dispatch
) => {
  dispatch({ type: AppActions.SET_TIME_INTERVAL, payload });
};

export const setActiveStatus = (payload: string) => (dispatch: Dispatch) => {
  dispatch({ type: AppActions.SET_ACTIVE_STATUS, payload });
};

export const setSizeStats = (payload: string) => (dispatch: Dispatch) => {
  dispatch({ type: AppActions.SET_SIZE_STATS, payload });
};
