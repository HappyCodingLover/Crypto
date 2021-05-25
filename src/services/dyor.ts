import { getTokenAddressFromId } from '../utils'

import { coingeckoAPIUrl } from '../config/settings'
import { WBNB_ADDRESS, WETH_ADDRESS } from '../config/tokens'
import { Token } from '../index'
import { apiFetch } from '../dexguruFetch'

export const getCoingeckoData = async (activeToken: Token) => {
  let url

  const tokenAddress = getTokenAddressFromId(activeToken)
  const tokenNetwork = activeToken.network

  if (tokenNetwork === 'eth') {
    url =
      tokenAddress === WETH_ADDRESS
        ? `${coingeckoAPIUrl}/coins/ethereum`
        : `${coingeckoAPIUrl}/coins/ethereum/contract/${tokenAddress}`
  }
  if (tokenNetwork === 'bsc') {
    url =
      tokenAddress === WBNB_ADDRESS
        ? `${coingeckoAPIUrl}/coins/binancecoin`
        : `${coingeckoAPIUrl}/coins/binance-smart-chain/contract/${tokenAddress}`
  }

  if (url) {
    try {
      return await apiFetch(url) // missing error handling
    } catch (err) {
      console.error('Could not get coingecko data', err)
      return null
    }
  } else {
    return null
  }
}
