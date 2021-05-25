import { AnyAction } from 'redux'
import { Trade } from '../index'

export const SET_PREVIOUS_TRADING_HISTORY = 'SET_PREVIOUS_TRADING_HISTORY'

const previousTradingHistory = (state: TradingHistoryState | null = null, action: AnyAction) => {
  switch (action.type) {
    case SET_PREVIOUS_TRADING_HISTORY:
      return action.previousTradingHistory
    default:
      return state
  }
}

export type TradingHistoryState = Trade[]

export default previousTradingHistory
