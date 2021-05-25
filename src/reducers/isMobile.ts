import { AnyAction } from 'redux'

export const SET_IS_MOBILE = 'SET_IS_MOBILE'

const isMobile = (state: IsMobileState = null, action: AnyAction) => {
  switch (action.type) {
    case SET_IS_MOBILE:
      return action.isMobile
    default:
      return state
  }
}

export type IsMobileState = boolean | null

export default isMobile
