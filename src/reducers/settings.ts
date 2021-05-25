import { DEFAULT_GAS, DEFAULT_SLIPPAGE, SLIPPAGE_TAX_WHEN_FEES } from '../config/settings'
import { AnyAction } from 'redux'
import { Settings } from '../index'

export const SET_SETTINGS = 'SET_SETTINGS'

const settings = (
  state: Settings = {
    slippage: DEFAULT_SLIPPAGE,
    slippageWithFees: DEFAULT_SLIPPAGE + SLIPPAGE_TAX_WHEN_FEES,
    gasFee: DEFAULT_GAS,
    pushNotifications: false,
  },
  action: AnyAction
) => {
  switch (action.type) {
    case SET_SETTINGS:
      return action.settings
    default:
      return state
  }
}

export default settings
