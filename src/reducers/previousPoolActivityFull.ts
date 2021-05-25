import { PoolTrade } from '../index'
import { AnyAction } from 'redux'

export const SET_PREVIOUS_POOL_ACTIVITY_FULL = 'SET_PREVIOUS_POOL_ACTIVITY_FULL'
const previousPoolActivityFull = (
  state: PreviousPoolActivityFullState | null = null,
  action: AnyAction
) => {
  switch (action.type) {
    case SET_PREVIOUS_POOL_ACTIVITY_FULL:
      return action.previousPoolActivityFull
    default:
      return state
  }
}

export type PreviousPoolActivityFullState = PoolTrade[]

export default previousPoolActivityFull
