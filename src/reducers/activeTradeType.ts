import { TradeType } from '..'

export const SET_ACTIVE_TRADE_TYPE = 'SET_ACTIVE_TRADE_TYPE'

const activeTradeType = (
  state: ActiveTradeTypeState | null = null,
  action: { type: string; activeTradeType: TradeType }
) => {
  switch (action.type) {
    case SET_ACTIVE_TRADE_TYPE:
      return action.activeTradeType
    default:
      return state
  }
}

export type ActiveTradeTypeState = TradeType

export default activeTradeType
