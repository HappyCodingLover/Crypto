import { actionTypes } from '../actions';
import { fromJS } from 'immutable';
const initialState = fromJS({
    theme:'light'
});

const appReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.THEME_UPDATE: {
        return state.set("theme",payload.theme);
    }
    case actionTypes.IS_MOBILE:{
        return state.set("isMobileWidth",payload.isMobileWidth);
    }

    default:
      return state;
  }
};

export default appReducer;
