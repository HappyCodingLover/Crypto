import { MOBILE_THRESHOLD } from '../config/settings'

export const checkMobile = () => {
  return (
    document.documentElement.offsetWidth <= MOBILE_THRESHOLD &&
    process.env.REACT_APP_MOBILE_ON === 'true'
  )
}
