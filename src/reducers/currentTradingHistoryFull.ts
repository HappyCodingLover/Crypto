import { AnyAction } from 'redux'
import { Trade } from '../index'

export const SET_CURRENT_TRADING_HISTORY_FULL = 'SET_CURRENT_TRADING_HISTORY_FULL'

const currentTradingHistoryFull = (
  state: CurrentTradingHistoryFullState | null = null,
  action: AnyAction
) => {
  switch (action.type) {
    case SET_CURRENT_TRADING_HISTORY_FULL:
      return action.currentTradingHistoryFull
    default:
      return state
  }
}

export type CurrentTradingHistoryFullState = Trade[]

export default currentTradingHistoryFull
