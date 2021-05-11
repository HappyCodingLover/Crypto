import { actionTypes } from '../actions';
import { fromJS } from 'immutable';
const initialState = fromJS({
    wallet:{}
});

const walletReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.WALLET_CONNECTED: {
      const isOpen = state.get('formVisible');
      return state.set('formVisible', !isOpen);
    }

    default:
      return state;
  }
};

export default walletReducer;
