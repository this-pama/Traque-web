import { SET_USER_DATA, CLEAR_STORE } from "../actions/actionTypes";

import ls from "../localStorage";

const USER_STATE = "USER_STATE";

// const initialState = ls.loadState(USER_STATE) || null
const initialState = ls.loadState(USER_STATE) || null;

const user = (state = initialState, action) => {
  switch (action.type) {
    case SET_USER_DATA:
      const newState = {
        ...state,
        ...action.payload,
      };
      // save user data to local storage
      ls.saveState(USER_STATE, newState);
      return newState;
    case CLEAR_STORE:
      // when user logs out, clear local storage data
      ls.clearState(USER_STATE);
      return null;
    default:
      return state;
  }
};

export default user;
