import BigNumber from 'bignumber.js'
import { SLIPPAGE_TAX_WHEN_FEES } from '../../config/settings'

export type Options = { id: number; value: string }[]

export const tooltipText =
  'Slippage is a difference between the quoted price and the executed price of your trade.'

export const slippageAdjustedMessage =
  "This token's smart contract taxes each transaction. We adjusted slippage settings for you automatically"

export const liquidityDropMessage =
  'More than 10% of dollar value drop for your trade due to low liquidity.'

export const options: Options = [
  { id: 0, value: '0.5' },
  { id: 1, value: '1' },
  { id: 2, value: '3' },
]

export const optionsWithFees: Options = options.map((o) => {
  return { id: o.id, value: String(Number(o.value) + SLIPPAGE_TAX_WHEN_FEES) }
})

export const isPoop = (gasCosts: BigNumber, fromAmount: BigNumber) =>
  (100 * (Number(gasCosts?.toFixed()) || 0)) / Number(fromAmount?.toFixed() || 0) > 25

export const feeTitle = (activeToken: { network: string }) =>
  activeToken.network === 'eth' ? 'Ethereum Network Fee:' : 'BSC Network Fee'
