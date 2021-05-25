import { Token } from '../index'
import { AnyAction } from 'redux'

export const SET_CURRENT_TOKEN = 'SET_CURRENT_TOKEN'
export const UPDATE_CURRENT_TOKEN = 'UPDATE_CURRENT_TOKEN'

const currentToken = (state: CurrentTokenState | {} = {}, action: AnyAction) => {
  switch (action.type) {
    case SET_CURRENT_TOKEN:
      return action.currentToken
    case UPDATE_CURRENT_TOKEN:
      return { ...state, ...action.payload }
    default:
      return state
  }
}

export type CurrentTokenState = Token & {
  isTokenApproved: boolean
  approvalComplete: boolean
  error?: Error
}
export default currentToken
