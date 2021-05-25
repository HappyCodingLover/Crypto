import { ChartData, Settings, Token, TokenPriceUSD, TradeType } from '..'
import { ADD_FAVORITE_TOKEN, REMOVE_FAVORITE_TOKEN, SET_FAVORITES } from '../reducers/favorites'
import { SET_TXN, TX_VERIFICATION_COMPLETE, TxnUpdate, UPDATE_TXN } from '../reducers/txn'
import { QuoteTokenState, SET_QUOTE_TOKEN, UPDATE_QUOTE_TOKEN } from '../reducers/quoteToken'
import { SET_IS_MOBILE } from '../reducers/isMobile'
import { SET_SETTINGS } from '../reducers/settings'
import { SET_TOKEN_PRICE_USD } from '../reducers/tokenPriceUSD'
import { SET_ACTIVE_TRADE_TYPE } from '../reducers/activeTradeType'
import { SET_TOKEN_LOADING } from '../reducers/tokenLoading'
import {
  CurrentTokenState,
  SET_CURRENT_TOKEN,
  UPDATE_CURRENT_TOKEN,
} from '../reducers/currentToken'
import { SET_CURRENCY } from '../reducers/currency'
import { SET_PREVIOUS_TRADING_HISTORY } from '../reducers/previousTradingHistory'
import { SET_PREVIOUS_POOL_ACTIVITY } from '../reducers/previousPoolActivity'
import { SET_CURRENT_POOL_ACTIVITY } from '../reducers/currentPoolActivity'
import { SET_PREVIOUS_TRADING_HISTORY_FULL } from '../reducers/previousTradingHistoryFull'
import { SET_CURRENT_TRADING_HISTORY_FULL } from '../reducers/currentTradingHistoryFull'
import { SET_CURRENT_POOL_ACTIVITY_FULL } from '../reducers/currentPoolActivityFull'
import { SET_PREVIOUS_POOL_ACTIVITY_FULL } from '../reducers/previousPoolActivityFull'
import { SET_CURRENT_TRADING_HISTORY } from '../reducers/currentTradingHistory'
import { SET_DATA_CHART } from '../reducers/dataChart'
import { setSettingsToLocalStorage } from '../services/preferencesService'

export const addFavorite = (token: Token) => ({
  type: ADD_FAVORITE_TOKEN,
  token,
})

export const removeFavorite = (token: Token) => ({
  type: REMOVE_FAVORITE_TOKEN,
  token,
})

export const setFavorites = (tokens: Token[]) => ({
  type: SET_FAVORITES,
  tokens,
})

export const setCurrency = (currency: string) => ({
  type: SET_CURRENCY,
  currency,
})

export const setTokenPriceUSD = (tokenPriceUSD: TokenPriceUSD) => ({
  type: SET_TOKEN_PRICE_USD,
  tokenPriceUSD,
})

export const setTxn = ({ key, txn }: any) => ({
  type: SET_TXN,
  payload: { key, txn },
})

export const updateTxn = ({ key, patch }: TxnUpdate) => ({
  type: UPDATE_TXN,
  payload: { key, patch },
})

export const changeVerificationComplete = ({ key, status }: TxnUpdate) => ({
  type: TX_VERIFICATION_COMPLETE,
  payload: { key, status },
})

export const setIsMobile = (isMobile: boolean) => ({
  type: SET_IS_MOBILE,
  isMobile,
})

export const setCurrentTradingHistory = (currentTradingHistory: any) => ({
  type: SET_CURRENT_TRADING_HISTORY,
  currentTradingHistory,
})

export const setPreviousTradingHistory = (previousTradingHistory: any) => ({
  type: SET_PREVIOUS_TRADING_HISTORY,
  previousTradingHistory,
})

export const setCurrentPoolActivity = (currentPoolActivity: any) => ({
  type: SET_CURRENT_POOL_ACTIVITY,
  currentPoolActivity,
})

export const setPreviousPoolActivity = (previousPoolActivity: any) => ({
  type: SET_PREVIOUS_POOL_ACTIVITY,
  previousPoolActivity,
})

export const setCurrentTradingHistoryFull = (currentTradingHistoryFull: any) => ({
  type: SET_CURRENT_TRADING_HISTORY_FULL,
  currentTradingHistoryFull,
})

export const setPreviousTradingHistoryFull = (previousTradingHistoryFull: any) => ({
  type: SET_PREVIOUS_TRADING_HISTORY_FULL,
  previousTradingHistoryFull,
})

export const setCurrentPoolActivityFull = (currentPoolActivityFull: any) => ({
  type: SET_CURRENT_POOL_ACTIVITY_FULL,
  currentPoolActivityFull,
})

export const setPreviousPoolActivityFull = (previousPoolActivityFull: any) => ({
  type: SET_PREVIOUS_POOL_ACTIVITY_FULL,
  previousPoolActivityFull,
})

export const setDataChart = (dataChart: ChartData) => ({
  type: SET_DATA_CHART,
  dataChart,
})

export const setLoading = (status: boolean = true) => ({
  type: SET_TOKEN_LOADING,
  status,
})

export const setSettings = (settings: Partial<Settings>) => ({ type: SET_SETTINGS, settings })

export const updateSettings = (settings: Partial<Settings>) => {
  setSettingsToLocalStorage(settings)

  return { type: SET_SETTINGS, settings }
}

export const setCurrentToken = (currentToken: Token) => ({
  type: SET_CURRENT_TOKEN,
  currentToken,
})

export const updateCurrentToken = (payload: Partial<CurrentTokenState>) => {
  return {
    type: UPDATE_CURRENT_TOKEN,
    payload,
  }
}

export const updateQuoteToken = (payload: Partial<QuoteTokenState>) => {
  return {
    type: UPDATE_QUOTE_TOKEN,
    payload,
  }
}

export const setQuoteToken = (quoteToken: Token | undefined) => ({
  type: SET_QUOTE_TOKEN,
  quoteToken,
})

export const activeTradeType = (activeTradeType: TradeType) => ({
  type: SET_ACTIVE_TRADE_TYPE,
  activeTradeType,
})
