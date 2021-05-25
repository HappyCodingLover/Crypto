import { combineReducers } from 'redux'

import { connectRouter } from 'connected-react-router'

import currency from './currency'
import currentToken, { CurrentTokenState } from './currentToken'
import quoteToken, { QuoteTokenState } from './quoteToken'
import tokenPriceUSD from './tokenPriceUSD'
import txn, { TxnState } from './txn'
import isMobile, { IsMobileState } from './isMobile'
import currentTradingHistory, { CurrentTradingHistoryState } from './currentTradingHistory'
import previousTradingHistory, { TradingHistoryState } from './previousTradingHistory'
import currentPoolActivity, { CurrentPoolActivityState } from './currentPoolActivity'
import previousPoolActivity, { PreviousPoolActivityState } from './previousPoolActivity'
import currentTradingHistoryFull, {
  CurrentTradingHistoryFullState,
} from './currentTradingHistoryFull'
import previousTradingHistoryFull, {
  PreviousTradingHistoryFullState,
} from './previousTradingHistoryFull'
import currentPoolActivityFull, { CurrentPoolActivityFullState } from './currentPoolActivityFull'
import previousPoolActivityFull, { PreviousPoolActivityFullState } from './previousPoolActivityFull'
import dataChart, { DataChartState } from './dataChart'
import tokenLoading from './tokenLoading'
import settings from './settings'
import { History } from 'history'
import activeTradeType, { ActiveTradeTypeState } from './activeTradeType'
import { Settings, TokenPriceUSD } from '../index'
import favorites, { FavoritesState } from './favorites'

const rootReducer = (history: History) =>
  combineReducers({
    currency,
    currentToken,
    quoteToken,
    tokenPriceUSD,
    txn,
    isMobile,
    currentTradingHistory,
    previousTradingHistory,
    currentPoolActivity,
    previousPoolActivity,
    currentTradingHistoryFull,
    previousTradingHistoryFull,
    currentPoolActivityFull,
    previousPoolActivityFull,
    dataChart,
    tokenLoading,
    settings,
    favorites,
    router: connectRouter(history),
    activeTradeType,
  })

export interface State {
  tokenPriceUSD: TokenPriceUSD
  txn: TxnState
  quoteToken: QuoteTokenState
  isMobile: IsMobileState
  currentToken: CurrentTokenState
  settings: Settings
  activeTradeType: ActiveTradeTypeState
  currency: string
  currentTradingHistory: CurrentTradingHistoryState
  currentTradingHistoryFull: CurrentTradingHistoryFullState
  previousTradingHistory: TradingHistoryState
  previousTradingHistoryFull: PreviousTradingHistoryFullState
  currentPoolActivityFull: CurrentPoolActivityFullState
  currentPoolActivity: CurrentPoolActivityState
  previousPoolActivityFull: PreviousPoolActivityFullState
  previousPoolActivity: PreviousPoolActivityState
  dataChartState: DataChartState
  favorites: FavoritesState
}

export default rootReducer
