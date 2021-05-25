import { AnyAction } from 'redux'
import { PoolTrade } from '../index'

export const SET_CURRENT_POOL_ACTIVITY = 'SET_CURRENT_POOL_ACTIVITY'

const currentPoolActivity = (state: CurrentPoolActivityState | null = null, action: AnyAction) => {
  switch (action.type) {
    case 'SET_CURRENT_POOL_ACTIVITY':
      return action.currentPoolActivity
    default:
      return state
  }
}

export type CurrentPoolActivityState = PoolTrade[]

export default currentPoolActivity
