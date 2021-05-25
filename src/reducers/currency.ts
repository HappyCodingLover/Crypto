import { AnyAction } from 'redux'

export const SET_CURRENCY = 'SET_CURRENCY'

const currency = (state: string | null = null, action: AnyAction) => {
  switch (action.type) {
    case SET_CURRENCY:
      return action.currency
    default:
      return state
  }
}

export default currency
