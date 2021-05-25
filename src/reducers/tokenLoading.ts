import { AnyAction } from 'redux'

export const SET_TOKEN_LOADING = 'SET_TOKEN_LOADING'

const tokenLoading = (state = true, action: AnyAction) => {
  switch (action.type) {
    case SET_TOKEN_LOADING:
      return action.status
    default:
      return state
  }
}

export default tokenLoading
