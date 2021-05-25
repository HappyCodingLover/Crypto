import { getErc20Balance, getEthBalance, getTokenAddressFromId } from '../utils'
import { WBNB_ADDRESS, WETH_ADDRESS } from '../config/tokens'
import { BigNumber } from 'bignumber.js'
import { Token, TokenNetwork } from '../index'

export const getUserBalance = async ({
  library,
  account,
  tokenNetwork,
  walletNetwork,
  tokenFrom,
}: {
  library: any
  account?: string | null
  tokenNetwork: TokenNetwork
  walletNetwork?: TokenNetwork
  tokenFrom: Token
}): Promise<BigNumber> => {
  if (!library || !account || tokenNetwork !== walletNetwork) {
    return new BigNumber(0)
  }
  const tokenFromAddress = getTokenAddressFromId(tokenFrom)
  if (
    (tokenFromAddress === WETH_ADDRESS && tokenNetwork === 'eth') ||
    (tokenFromAddress === WBNB_ADDRESS && tokenNetwork === 'bsc')
  ) {
    const balance = new BigNumber(await getEthBalance(account, library)).div(10 ** 18)
    return balance.gt(0) ? balance : new BigNumber(0)
  }
  const balanceFrom = await getErc20Balance(tokenFromAddress, account, library)
  return new BigNumber(balanceFrom).div(10 ** tokenFrom.decimals)
}
