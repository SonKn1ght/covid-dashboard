import { AppActions, IAppState } from "@types";
import { AnyAction, Dispatch } from "redux";

export function searchReducer(state: IAppState, action: AnyAction) {
  const { payload, type } = action;
  let searchValue = state.searchValue;
  switch (type) {
    case AppActions.SET_SEARCH_VALUE:
      searchValue = payload;
      return {
        ...state,
        searchValue,
      };
    default:
      return state;
  }
}

export const setSearchValue = (payload: string) => (
  dispatch: Dispatch
) => {
  dispatch({ type: AppActions.SET_SEARCH_VALUE, payload });
};
