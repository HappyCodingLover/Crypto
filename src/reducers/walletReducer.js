import { actionTypes } from '../actions';
import { fromJS } from 'immutable';
const initialState = fromJS({
    isConnected:false,
    wallet:{},
    isShowProviderDialog:false
});

const walletReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.WALLET_CONNECTED: {

    }
    case actionTypes.OPEN_PROVIDER_MENU:{
      console.log(payload)
          return state.set("isShowProviderDialog",payload.status);
    }

    default:
      return state;
  }
};

export default walletReducer;
