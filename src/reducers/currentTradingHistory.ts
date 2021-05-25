import { AnyAction } from 'redux'
import { Trade } from '../index'

export const SET_CURRENT_TRADING_HISTORY = 'SET_CURRENT_TRADING_HISTORY'

const currentTradingHistory = (state = null, action: AnyAction) => {
  switch (action.type) {
    case SET_CURRENT_TRADING_HISTORY:
      return action.currentTradingHistory
    default:
      return state
  }
}

export type CurrentTradingHistoryState = Trade[]

export default currentTradingHistory
