import { actionTypes } from '../actions';
import { fromJS } from 'immutable';
const initialState = fromJS({
    isConnected:false,
    wallet:{},
    isShowProviderDialog:false,
    selectedToken: {}
});

const walletReducer = (state = initialState, action) => {
  const { type, payload } = action;
  switch (type) {
    case actionTypes.WALLET_CONNECTED: {

    }
    case actionTypes.OPEN_PROVIDER_MENU:{

          return state.set("isShowProviderDialog",payload.status);
    }
    case actionTypes.SET_SELECTED_TOKEN:{
        return state.set("selectedToken",payload.token);
    }

    default:
      return state;
  }
};

export default walletReducer;
