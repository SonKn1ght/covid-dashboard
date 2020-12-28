import { AppActions, IAppState } from "@types";
import { AnyAction, Dispatch } from "redux";

export function popupReducer(state: IAppState, action: AnyAction) {
  let popup = !state.popup;
      return {
        ...state,
        popup,
      };
}

export const setPopupState = () => (
  dispatch: Dispatch
) => {
  dispatch({ type: AppActions.SEP_POPUP_STATUS });
};
