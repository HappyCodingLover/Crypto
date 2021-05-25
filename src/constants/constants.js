import { BigNumber } from 'bignumber.js'

export const ETH = 'eth'
export const BSC = 'bsc'
export const NETWORK = { eth: ETH, bsc: BSC }
export const CHAIN_ID = 1
export const APPROVAL_CONFIRMED_TIMEOUT = 7000
export const MAX_UINT = new BigNumber(2).pow(256).minus(1)
