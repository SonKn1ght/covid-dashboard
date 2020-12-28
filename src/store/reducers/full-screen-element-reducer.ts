import { AppActions, IAppState } from "@types";
import { AnyAction, Dispatch } from "redux";

export function fullScreenElementReducer(state: IAppState, action: AnyAction) {
  const { type } = action;
  let fullScreenElement = state.fullScreenElement;
  switch (type) {
    case AppActions.SET_FULL_SCREEN:
      fullScreenElement = !fullScreenElement;
      return {
        ...state,
        fullScreenElement,
      };
    default:
      return state;
  }
}

export const setFullScreenElementValue = () => (
  dispatch: Dispatch
) => {
  dispatch({ type: AppActions.SET_FULL_SCREEN });
};
