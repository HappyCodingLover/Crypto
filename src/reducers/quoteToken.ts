import { AnyAction } from 'redux'
import { Token } from '..'

export const SET_QUOTE_TOKEN = 'SET_QUOTE_TOKEN'
export const UPDATE_QUOTE_TOKEN = 'UPDATE_QUOTE_TOKEN'

const quoteToken = (state: QuoteTokenState | null = null, action: AnyAction) => {
  switch (action.type) {
    case SET_QUOTE_TOKEN:
      return action.quoteToken
    case UPDATE_QUOTE_TOKEN:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export type QuoteTokenState = Token & {
  isTokenApproved: boolean
  approvalComplete: boolean
  error?: Error
}

export default quoteToken
