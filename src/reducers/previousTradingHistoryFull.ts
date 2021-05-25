import { AnyAction } from 'redux'
import { Trade } from '../index'

export const SET_PREVIOUS_TRADING_HISTORY_FULL = 'SET_PREVIOUS_TRADING_HISTORY_FULL'
const previousTradingHistoryFull = (
  state: PreviousTradingHistoryFullState | null = null,
  action: AnyAction
) => {
  switch (action.type) {
    case SET_PREVIOUS_TRADING_HISTORY_FULL:
      return action.previousTradingHistoryFull
    default:
      return state
  }
}

export type PreviousTradingHistoryFullState = Trade[]

export default previousTradingHistoryFull
