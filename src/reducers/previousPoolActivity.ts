import { AnyAction } from 'redux'
import { PoolTrade } from '../index'

export const SET_PREVIOUS_POOL_ACTIVITY = 'SET_PREVIOUS_POOL_ACTIVITY'

const previousPoolActivity = (
  state: PreviousPoolActivityState | null = null,
  action: AnyAction
) => {
  switch (action.type) {
    case SET_PREVIOUS_POOL_ACTIVITY:
      return action.previousPoolActivity
    default:
      return state
  }
}

export type PreviousPoolActivityState = PoolTrade[]

export default previousPoolActivity
