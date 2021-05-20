import uiConfig from './uiConfig';
import walletConfig from './walletConfig';
import tokenConfig from './tokenConfig';
import { combineReducers } from 'redux'
import { connectRouter } from 'connected-react-router'
const rootReducer = (history) =>
    combineReducers({
        router: connectRouter(history),
        uiConfig,
        tokenConfig,
        walletConfig
    })

export default rootReducer
