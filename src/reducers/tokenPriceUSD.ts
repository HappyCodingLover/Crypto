import { AnyAction } from 'redux'
import { TokenPriceUSD } from '../index'

export const SET_TOKEN_PRICE_USD = 'SET_TOKEN_PRICE_USD'

const tokenPriceUSD = (state: TokenPriceUSD = defaultState, action: AnyAction) => {
  switch (action.type) {
    case SET_TOKEN_PRICE_USD:
      return action.tokenPriceUSD
    default:
      return state
  }
}

const defaultState: TokenPriceUSD = {
  ethPrice: 0,
  bnbPrice: 0,
}

export default tokenPriceUSD
