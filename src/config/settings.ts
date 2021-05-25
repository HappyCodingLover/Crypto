import Etherscan from '../images/icons/etherscan.svg'
import Bscscan from '../images/icons/bscscan.svg'
import { BigNumber } from 'bignumber.js'
import { GasFeeType } from '../index'

export const appGitVersion = process.env.GIT_COMMIT
export const appName = 'dexGuru'

export const zeroXAPIUrlEth = 'https://api.0x.org'
export const zeroXAPIUrlBsc = 'https://bsc.api.0x.org'
export const dexGuruAPIUrl = 'https://api.dex.guru/v1' //'https://api.beta.dex.guru/v1'
export const gasNowAPIUrl = 'https://www.gasnow.org/api/v3'
export const zeroXGasAPIURLEth = 'https://gas.api.0x.org/'
export const zeroXGasAPIURLBsc = 'https://gas.bsc.api.0x.org/'
export const coingeckoAPIUrl = 'https://api.coingecko.com/api/v3'
export const balancesAPIUrl = 'wss://wb.dexguru.net/address'
export const balancesAPIKey = 'Zjc1ODljZDBkYTgxODVlZjIyYTViNjJi'

export const infuraApiKey = '407161c0da4c4f1b81f3cc87ca8310a7'
export const updatePeriodMs = 15000

export const SIDEBARS_ANIMATIONS_TIMEOUT = 5000
export const HISTORY_DATA_REFRESH_INTERVAL = 10 * 60 * 1000 // 10 min
export const TOKEN_DATA_REFRESH_INTERVAL = 10 * 60 * 1000 // 10 min
export const TXN_DATA_REFRESH_INTERVAL = 60 * 1000 // 60 sec

export const periodSidebarChart = 90
export const referrerAddress = '0x720c9244473Dfc596547c1f7B6261c7112A3dad4'

export const MAIN_QUOTE_TOKEN_ADDRESSES = {
  eth: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
  bsc: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c',
}
export const SECONDARY_QUOTE_TOKEN_ADDRESSES = {
  eth: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
  bsc: '0xe9e7cea3dedca5984780bafc599bd69add087d56',
}

export const zeroXAPIUrls = {
  eth: zeroXAPIUrlEth,
  bsc: zeroXAPIUrlBsc,
}

export const zeroXGasAPIURL = {
  eth: zeroXGasAPIURLEth,
  bsc: zeroXGasAPIURLBsc,
}

export const blockExplorerUrls = {
  eth: 'https://etherscan.io/',
  bsc: 'https://bscscan.com/',
}

export const blockExplorerIcons = {
  eth: Etherscan,
  bsc: Bscscan,
}

export const walletUrls = {
  eth: 'https://app.zerion.io/',
  bsc: 'https://app.zerion.io/',
}

export const MOBILE_THRESHOLD = 600

export const GAS_BUFFER_ETH = new BigNumber(5 * 10 ** 16).div(10 ** 18)
export const GAS_BUFFER_BSC = new BigNumber(2 * 10 ** 16).div(10 ** 18)

export const TOP_TOKEN_ID = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599'

export const DEFAULT_SLIPPAGE = 1
export const DEFAULT_GAS: GasFeeType = 'instant'
export const UPDATE_TIP_DELAY = 1000
export const DEFAULT_TIP = 0

export const DEFAULT_TRANSACTIONS_TRADING_HISTORY = 1000
export const DEFAULT_TRANSACTIONS_POOL_ACTIVITY = 500

export const DEFAULT_SYMBOL_NAME = '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599_USD'

export const DEBOUNCE_INPUT = 1000

export const API_REQUEST_ATTEMPTS = 2
export const API_REQUEST_INTERVAL = 5000

export const QUOTE_AUTOREFRESH_INTERVAL = 90000
export const QUOTE_REFRESHABLE_INTERVAL = 30000

export const DEFAULT_DELAY_PRELOADER_DYOR = 1000
export const CLOSE_MODAL_TIMEOUT = 90000

export const BALANCE_DELAY = 2000
export const BALANCE_MAX_DELAY = 16000

export const GTM_ID = 'GTM-KGNN7R6'
export const GTM_PURCHASE_TRESHOLD_TOP = 15 * 10 ** 6 // $15M

export const SLIPPAGE_TAX_WHEN_FEES = 11

export const RESET_TXN_DELAY = 3000
