import { AnyAction } from 'redux'
import { PoolTrade } from '../index'

export const SET_CURRENT_POOL_ACTIVITY_FULL = 'SET_CURRENT_POOL_ACTIVITY_FULL'

const currentPoolActivityFull = (state = null, action: AnyAction) => {
  switch (action.type) {
    case SET_CURRENT_POOL_ACTIVITY_FULL:
      return action.currentPoolActivityFull
    default:
      return state
  }
}

export type CurrentPoolActivityFullState = PoolTrade[]

export default currentPoolActivityFull
