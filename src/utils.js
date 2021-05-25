import { WBNB_ADDRESS, WETH_ADDRESS, ZERO_X_ETH_ADDRESS } from './config/tokens'
import { NETWORK } from './constants/constants'
import { dexGuruAPIUrl } from '../src/config/settings'
import erc20ABI from './abi/erc20'
import accounting from 'accounting'

export const getShortNumber = (number, decimal) => {
  if (number > 100000000) return `${(number / 1000000000).toFixed(decimal)}B`
  if (number > 100000) return `${(number / 1000000).toFixed(decimal)}M`
  if (number > 100) return `${(number / 1000).toFixed(decimal)}K`

  return number
}

export const getShortTopNumber = (number, decimal) => {
  if (number >= 1000000000) return `${(number / 1000000000).toFixed(decimal)}B`

  return financialFormat(number, 0)
}

export const getShortAccount = (account) => {
  return account.substring(0, 5) + '…' + account.substring(account.length - 4)
}

export const setTokenToLocalStorage = (currentToken, account) => {
  localStorage.setItem('anonimToken', JSON.stringify(currentToken))
  if (!account) {
    return
  }
  let accountsList = JSON.parse(localStorage.getItem('accounts'))
  if (!accountsList) accountsList = {}
  accountsList[account] = accountsList[account]
    ? { ...accountsList[account], memoryToken: currentToken }
    : { memoryToken: currentToken }
  localStorage.setItem('accounts', JSON.stringify(accountsList))
}

export const getTokenFromLocalStorage = (account) => {
  if (!account) {
    return JSON.parse(localStorage.getItem('anonimToken'))
  }
  const accountsList = JSON.parse(localStorage.getItem('accounts'))
  return accountsList && accountsList[account].memoryToken
    ? accountsList[account].memoryToken
    : null
}

export const replaceWrapperTokenToToken = (symbol = '') => {
  switch (symbol) {
    case 'WETH':
      return 'ETH'
    case 'WBNB':
      return 'BNB'
    default:
      return symbol
  }
}

export const replaceWethToEthAddress = (address) => {
  return address === WETH_ADDRESS || address === WBNB_ADDRESS ? ZERO_X_ETH_ADDRESS : address
}

export const numberWithCommas = (x) => {
  if (!x) return NaN
  const parts = x.toString().split('.')

  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts[1] && parts[1] === '' ? `${parts[0]}.` : parts.join('.')
}

export const getErc20Balance = async (tokenAddress, account, web3) => {
  const erc20Contract = new web3.eth.Contract(erc20ABI, tokenAddress)
  return await erc20Contract.methods.balanceOf(account).call()
}

export const getEthBalance = async (account, web3) => {
  return await web3.eth.getBalance(account)
}

export const financialFormat = (digitalValue, decimal = null) => {
  if (decimal !== null) return accounting.formatNumber(digitalValue, decimal)
  return accounting.formatNumber(digitalValue, digitalValue >= 1 ? 2 : 4)
}

export const financialFormatRoundUSD = (digitalValue) => {
  if (digitalValue >= 1000000000) return `${(digitalValue / 1000000000).toFixed(2)}B`
  if (digitalValue >= 1) return accounting.formatNumber(digitalValue, 0)
  else return accounting.formatNumber(digitalValue, 4)
}

export const financialFormatRound = (digitalValue, decimal = null) => {
  if (decimal !== null) return accounting.formatNumber(digitalValue, decimal)
  if (digitalValue >= 1000000000) return `${(digitalValue / 1000000000).toFixed(2)}B`
  if (digitalValue >= 1000000) return accounting.formatNumber(digitalValue, 0)
  return accounting.formatNumber(digitalValue, digitalValue >= 1 ? 2 : 4)
}

export const isTitleNaN = (title) => {
  return String(title) === 'NaN' ? '0' : String(title)
}

export const getTokenAllowance = async (tokenAddress, spender, account, web3) => {
  let result = 0
  const erc20Contract = new web3.eth.Contract(erc20ABI, tokenAddress)
  result = await erc20Contract.methods.allowance(account, spender).call()
  return result
}

export function getHeightTableSidebar(element) {
  const header = document.querySelector('.header')
  const dashboard = document.querySelector('.dashboard')

  const dashboardHeight = dashboard && dashboard.getBoundingClientRect().height
  const headerHeight = header && header.getBoundingClientRect().height
  const bodyHeight = headerHeight + dashboardHeight

  const windowHeight = window.innerHeight
  const sidebarHeight =
    windowHeight > bodyHeight ? windowHeight - headerHeight : bodyHeight - headerHeight
  const topSidebar = document.querySelector('.chart-sidebar')
  const titleTable = element.querySelector('.title-table-sidebar')
  const headerTable = element.querySelector('.thead-table-sidebar')

  const topSidebarHeight = topSidebar && topSidebar.getBoundingClientRect().height
  const titleTableHeight = titleTable && titleTable.getBoundingClientRect().height
  const headerTableHeight = headerTable && headerTable.getBoundingClientRect().height
  const padding = 40 + 16
  const tableHeight =
    sidebarHeight - topSidebarHeight - titleTableHeight - headerTableHeight - padding
  return tableHeight
}

export function calculateMobile(sidebarNumber) {
  var counter = 0
  const topPart = document.querySelectorAll('.chart-sidebar')[0]
  const header = document.querySelectorAll('.header')[0]
  const additional = sidebarNumber === 1 ? 8 : 0

  if (topPart && header) {
    counter +=
      window.innerHeight - topPart?.clientHeight - header?.clientHeight - additional - 64 - 82 - 24
  } else {
    counter += 360
  }
  return counter
}

export const getNetworkByChainId = (chainId) => {
  if (chainId === 56) {
    return 'bsc'
  }
  if (chainId === 97) {
    return 'bsc'
  }
  if (chainId === 1) {
    return 'eth'
  }
}

export const getTokenNetworkByAmm = (amm) => {
  const ecosystem = amm.split('_')[0]
  if (ecosystem[0] === 'bsc') {
    return 'bsc'
  }
  if (ecosystem[0] === 'eth') {
    return 'eth'
  }
  return 'eth'
}

export const getTokenAddressFromId = (token) => {
  return token.id ? token.id.split('-')[0] : token.split('-')[0]
}

export const deleteDuplicatedItem = (array) => {
  const uniqueSet = new Set(array)
  return [...uniqueSet]
}
export const getShortNameToken = (activeToken) => {
  let shortedSymbol = replaceWrapperTokenToToken(activeToken.symbol)
  if (activeToken.symbol.length > 10) {
    shortedSymbol = activeToken.symbol.substring(0, 7) + '…'
  }
  return shortedSymbol
}

export const getHeightElement = (element) => {
  if (element) {
    const elementBoundingClientRect = element.getBoundingClientRect()
    return elementBoundingClientRect.height
  }
}

export const getConvertedTime = (date) => {
  let seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

  let interval = Math.floor(seconds / 31536000)

  if (interval > 1) {
    return interval + ' y'
  }
  interval = Math.floor(seconds / 2592000)
  if (interval > 1) {
    return interval + ' m'
  }
  interval = Math.floor(seconds / 86400)
  if (interval > 1) {
    return interval + ' d'
  }
  interval = Math.floor(seconds / 3600)
  if (interval > 1) {
    return interval + ' h'
  }
  interval = Math.floor(seconds / 60)
  if (interval > 1) {
    return interval + ' m'
  }
  return Math.floor(seconds) + ' s'
}

export const sleep = (ms) => {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Generic retry function of async operations depending on errors
 * @param task the call that should be made
 * @param shouldRetry a test that can check if a retry attempt should be done depending on the error
 * @param interval how much time between calls
 * @param attempts how many attempts
 */
export async function asyncRetry(task, shouldRetry, interval, attempts) {
  try {
    return await task()
  } catch (err) {
    if (shouldRetry(err) && attempts > 0) {
      await sleep(interval)
      return asyncRetry(task, shouldRetry, interval, attempts - 1)
    } else {
      throw err
    }
  }
}

export const checkTokensAddressAndNetwork = (token, tokenNetwork) =>
  (getTokenAddressFromId(token) === WETH_ADDRESS && tokenNetwork === NETWORK.eth) ||
  (getTokenAddressFromId(token) === WBNB_ADDRESS && tokenNetwork === NETWORK.bsc)

export const grabErrors = ({ reason, validationErrors = [] }) => {
  let statusText = reason + ':'
  validationErrors.forEach((item) => {
    statusText += ' ' + item.field + ' - ' + item.reason + ';'
  })

  return statusText
}

export const getTokenUrlTemplate = (id, network = undefined) => {
  if (network) {
    return `${dexGuruAPIUrl}/tokens/${id}?network=${network}`
  } else {
    return `${dexGuruAPIUrl}/tokens/${id}`
  }
}
