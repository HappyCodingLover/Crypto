import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import { routerReducer } from 'react-router-redux';
import { loadState, saveState } from './localStore';

import {
  appReducer,
  walletReducer

} from './reducers';

const reducers = combineReducers({
    appReducer: appReducer,
    walletReducer: walletReducer
});

const preloadedState = loadState();

const middleware = applyMiddleware(thunk);

const store = createStore(reducers, preloadedState, middleware);

store.subscribe(() => {
  saveState(store.getState());
});

export default store;
