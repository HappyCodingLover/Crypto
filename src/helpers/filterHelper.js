import { BigNumber } from 'bignumber.js'
import { financialFormatRound } from '../utils'

const filterAmm = (optionFilter, item) => optionFilter.amm === '' || item.AMM === optionFilter.amm

const filterDex = (optionFilter, isPoolActivity, currentToken, item) => {
  if (optionFilter.dex.length === '') return true

  if (isPoolActivity) {
    switch (optionFilter.dex) {
      case 'buy':
        return item.add
      case 'sell':
        return !item.add
      case 'all':
      default:
        return true
    }
  } else {
    const tokenInAddress =
      item.amount0In > 0 ? item.token0Address.toLowerCase() : item.token1Address.toLowerCase()
    const activeTokenIsTokenIn = tokenInAddress === currentToken
    switch (optionFilter.dex) {
      case 'buy':
        return !activeTokenIsTokenIn
      case 'sell':
        return activeTokenIsTokenIn
      case 'all':
      default:
        return true
    }
  }
}

const filterTradeSize = (optionFilter, item) => {
  const { amountUSD } = item
  if (optionFilter.tradeSize.value === '') return true

  switch (optionFilter.tradeSize.sign) {
    case 'equal':
      return financialFormatRound(new BigNumber(amountUSD)) === optionFilter.tradeSize.value
    case 'less':
      return amountUSD < optionFilter.tradeSize.value
    case 'more':
      return amountUSD > optionFilter.tradeSize.value
    default:
      return true
  }
}

const filterSoldToken = (optionFilter, isPoolActivity, item) => {
  const { amount0, amount0In, amount1In } = item

  const tokenSold = isPoolActivity ? amount0 : amount0In > 0 ? amount0In : amount1In

  if (optionFilter.soldToken.value !== '') {
    switch (optionFilter.soldToken.sign) {
      case 'equal':
        return financialFormatRound(new BigNumber(tokenSold)) === optionFilter.soldToken.value
      case 'less':
        return tokenSold < optionFilter.soldToken.value
      case 'more':
        return tokenSold > optionFilter.soldToken.value
      default:
        return true
    }
  }
  return true
}

const filterSoldTokenSymbol = (optionFilter, isPoolActivity, item) => {
  const { amount0In, token0Symbol: symbol0, token1Symbol: symbol1 } = item

  const tokenSoldSymbol = isPoolActivity ? symbol0 : amount0In > 0 ? symbol0 : symbol1

  if (optionFilter.soldToken.symbol !== '') {
    return tokenSoldSymbol === optionFilter.soldToken.symbol
  }
  return true
}

const filterBoughtToken = (optionFilter, isPoolActivity, item) => {
  const { amount1, amount0Out, amount1Out } = item

  const tokenBought = isPoolActivity ? amount1 : amount0Out > 0 ? amount0Out : amount1Out

  if (optionFilter.boughtToken.value !== '') {
    switch (optionFilter.boughtToken.sign) {
      case 'equal':
        return financialFormatRound(new BigNumber(tokenBought)) === optionFilter.boughtToken.value
      case 'less':
        return tokenBought < optionFilter.boughtToken.value
      case 'more':
        return tokenBought > optionFilter.boughtToken.value
      default:
        return true
    }
  }

  return true
}

const filterBoughtTokenSymbol = (optionFilter, isPoolActivity, item) => {
  const { amount0Out, token0Symbol: symbol0, token1Symbol: symbol1 } = item

  const tokenBoughtSymbol = isPoolActivity ? symbol1 : amount0Out > 0 ? symbol0 : symbol1

  if (optionFilter.boughtToken.symbol !== '') {
    return tokenBoughtSymbol === optionFilter.boughtToken.symbol
  }
  return true
}

const filterWalletAddress = (optionFilter, item) =>
  optionFilter.walletAddress.value === '' || item.walletAddress === optionFilter.walletAddress.value

const filterWalletCategory = (optionFilter, isPoolActivity, item) => {
  if (isPoolActivity) return true

  if (optionFilter.walletCategoryValue.value.length === 0) return true

  return optionFilter.walletCategoryValue.value.includes(item.walletCategory)
}
const filterDate = (optionFilter, item) => {
  if (optionFilter.date.from && optionFilter.date.to) {
    return (
      optionFilter.date.from < 1000 * item.timestamp && 1000 * item.timestamp < optionFilter.date.to
    )
  }
  return true
}

export const getFilteredData = (data, optionFilter, isPoolActivity, currentToken) => {
  const filtered = data
    .filter(filterAmm.bind(this, optionFilter))
    .filter(filterDex.bind(this, optionFilter, isPoolActivity, currentToken))
    .filter(filterTradeSize.bind(this, optionFilter))
    .filter(filterSoldToken.bind(this, optionFilter, isPoolActivity))
    .filter(filterSoldTokenSymbol.bind(this, optionFilter, isPoolActivity))
    .filter(filterBoughtToken.bind(this, optionFilter, isPoolActivity))
    .filter(filterBoughtTokenSymbol.bind(this, optionFilter, isPoolActivity))
    .filter(filterWalletAddress.bind(this, optionFilter))
    .filter(filterWalletCategory.bind(this, optionFilter, isPoolActivity))
    .filter(filterDate.bind(this, optionFilter))
  return filtered
}
