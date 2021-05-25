import { BigNumber } from 'bignumber.js'
import { Token, TokenFees, TokenNetwork } from '..'
import {
  API_REQUEST_ATTEMPTS,
  API_REQUEST_INTERVAL,
  coingeckoAPIUrl,
  dexGuruAPIUrl,
  MAIN_QUOTE_TOKEN_ADDRESSES,
  SECONDARY_QUOTE_TOKEN_ADDRESSES,
  TOP_TOKEN_ID,
} from '../config/settings'
import {
  asyncRetry,
  getTokenAddressFromId,
  getTokenFromLocalStorage,
  setTokenToLocalStorage,
  checkTokensAddressAndNetwork,
  getTokenUrlTemplate,
} from '../utils'
import web3 from 'web3'
import { getIconToken } from './iconService'
import { store } from './reduxService'
import * as actions from '../actions'
import gtmService from './gtmService'
import { apiFetch } from '../dexguruFetch'

let tokenFeesList: TokenFees

export const doesTokenHaveFees = async (tokenFrom?: Token, tokenTo?: Token): Promise<boolean> => {
  const fees = await downloadTokenFeesList()
  return !!fees?.tokens.find((t) => t.symbol === tokenFrom?.symbol || t.symbol === tokenTo?.symbol)
}

const downloadTokenFeesList = async (): Promise<TokenFees | undefined> => {
  if (tokenFeesList) {
    return tokenFeesList
  }

  const rawContent = await apiFetch(
    'https://raw.githubusercontent.com/dex-guru/tokens-with-fees/main/fees.tokenlist.json',
    { expectJson: false, expectText: true }
  )

  tokenFeesList = JSON.parse(rawContent || 'undefined')
  return tokenFeesList
}

const getTokenFromApi = async (id: string, network?: string): Promise<Token | undefined> => {
  /* 
   we may end up with token id without a network (e.g. in url)
   in this case we pass such id in the endpoint and it's automatically fallbacks to 'eth'
   this is not ideal and need to be discussed
   however at the moment without this workaround we break the app sending ?network=undefined 
  */
  const url = getTokenUrlTemplate(id, network)
  return await apiFetch(url, { mapErrorTo: { shouldMap: true, targetValue: undefined } })
}

export function calculateTokenUsdPrices({
  tokenFrom,
  tokenTo,
}: {
  tokenFrom: Token
  tokenTo: Token
}): {
  fromTokenUsdPrice: BigNumber
  toTokenUsdPrice: BigNumber
} {
  const fromTokenUsdPrice = new BigNumber(tokenFrom.priceUSD)
  const toTokenUsdPrice = new BigNumber(tokenTo.priceUSD)
  return { fromTokenUsdPrice, toTokenUsdPrice }
}

export const getTokenPriceInUsd = async (
  tokenAddress: string,
  network: TokenNetwork
): Promise<number> => {
  const coingeckoNetwork = network === 'eth' ? 'ethereum' : 'binance-smart-chain'
  return await apiFetch(
    `${coingeckoAPIUrl}/simple/token_price/${coingeckoNetwork}?contract_addresses=${tokenAddress}&vs_currencies=usd`
  ).then(async (data) => {
    return data[tokenAddress] ? data[tokenAddress]['usd'] : 0
  })
}

export const getTokenInfo = async (tokenId: string): Promise<Token | undefined> => {
  const [id, network] = tokenId.split('-')
  return await getTokenFromApi(id, network)
}

export const searchTokensBySymbol = async (symbol: string): Promise<Token | undefined> => {
  const searchSymbol = web3.utils.isAddress(symbol.toLowerCase())
    ? symbol.toLowerCase()
    : symbol.toUpperCase()
  return await apiFetch(`${dexGuruAPIUrl}/tokens/search/${searchSymbol}?network=bsc`)
}

export const getSortedTokens = async (): Promise<Token[]> => {
  const request = await apiFetch(
    `${dexGuruAPIUrl}/tokens/?sort_by2=volume24hUSD&asc=false&from_num=0&size=150&network=bsc`,
    { mapErrorTo: { shouldMap: true, targetValue: [] } }
  )

  return request.data || []
}

export const getExchangeableTokens = async (
  symbol: string,
  tokenNetwork: string
): Promise<Token[]> => {
  if (!symbol) {
    return []
  }
  const response = await apiFetch(
    `${dexGuruAPIUrl}/tokens/search/${symbol}?network=${tokenNetwork}&sort_by=id&sort_by2=address&asc=false&from_num=0&size=3`,
    { mapErrorTo: { shouldMap: true, targetValue: { data: [] } } }
  )

  return response?.data?.slice(0, 3)
}

export const getQuoteToken = async (activeToken: Token): Promise<Token | undefined> => {
  const activeTokenNetwork = activeToken.network
  const quoteId = checkTokensAddressAndNetwork(activeToken, activeTokenNetwork)
    ? SECONDARY_QUOTE_TOKEN_ADDRESSES[activeTokenNetwork]
    : MAIN_QUOTE_TOKEN_ADDRESSES[activeTokenNetwork]

  let responseQuote = await asyncRetry(
    () => apiFetch(`${dexGuruAPIUrl}/tokens/${quoteId}?network=${activeTokenNetwork}`),
    () => true,
    API_REQUEST_INTERVAL,
    API_REQUEST_ATTEMPTS
  )

  const icon = await getIconToken(quoteId, activeTokenNetwork)
  responseQuote = { ...responseQuote, icon: icon }

  return responseQuote
}

export const setQuoteToken = async (quoteToken: Token): Promise<void> => {
  store.dispatch(actions.setQuoteToken(quoteToken))
  const { currentToken } = store.getState()
  gtmService.v3.viewProductDetails(currentToken, quoteToken)
  gtmService.v4.viewProductDetails(currentToken, quoteToken)
}

export const setQuoteTokenById = async (quoteTokenId: string): Promise<Token | undefined> => {
  const response = await getTokenDetails(quoteTokenId)

  if (!response) {
    return
  }

  const quoteTokenIdSplit = quoteTokenId.split('-')
  const tokenId: string = quoteTokenIdSplit[0]
  const tokenNetwork: TokenNetwork = quoteTokenIdSplit[1] as TokenNetwork

  const icon = await getIconToken(tokenId, tokenNetwork)
  const quoteToken: Token = { ...response, icon }

  store.dispatch(actions.setQuoteToken(quoteToken))
  const { currentToken } = store.getState()
  gtmService.v3.viewProductDetails(currentToken, quoteToken)
  gtmService.v4.viewProductDetails(currentToken, quoteToken)

  return quoteToken
}

export const storeTokens = async ({
  currentToken,
  Web3Account,
}: {
  currentToken: Token
  Web3Account: string
}) => {
  if (!currentToken) {
    throw new Error("current Token isn't defined")
  }

  const [id, network] = currentToken.id.split('-')
  currentToken.icon = await getIconToken(id, network)

  let quoteToken = store.getState().quoteToken
  if (currentToken.network !== quoteToken?.network || currentToken.id === quoteToken?.id) {
    quoteToken = await getQuoteToken(currentToken)
    store.dispatch(actions.setQuoteToken(quoteToken))
  }

  setTokenToLocalStorage(currentToken.id, Web3Account)
  store.dispatch(actions.setCurrentToken({ ...currentToken }))

  gtmService.v3.viewProductDetails(currentToken, quoteToken)
  gtmService.v4.viewProductDetails(currentToken, quoteToken)

  return { currentToken, quoteToken }
}

export const getTopToken = async (): Promise<any | undefined> => {
  try {
    return await asyncRetry(
      () => apiFetch(`${dexGuruAPIUrl}/tokens/${TOP_TOKEN_ID}`),
      () => true,
      API_REQUEST_INTERVAL,
      API_REQUEST_ATTEMPTS
    )
  } catch (err) {
    return
  }
}

export const getTokenDetails = async (tokenIdWithNetwork: string): Promise<Token | undefined> => {
  const tokenLowerCase = tokenIdWithNetwork.toLowerCase()
  const [id, network] = tokenLowerCase.split('-')
  return await getTokenFromApi(id, network)
}

export const setCurrentToken = async (currentToken: Token, account: any): Promise<void> => {
  await storeTokens({ currentToken, Web3Account: account })
}

export const initCurrentToken = async ({
  tokenIdWithNetwork,
  Web3Account,
}: {
  tokenIdWithNetwork: string
  Web3Account: any
}) => {
  store.dispatch(actions.setLoading(true))

  let token = getTokenFromLocalStorage(Web3Account)

  let currentToken = null
  let quoteToken: Token | undefined

  if (tokenIdWithNetwork) {
    const tokenAddress = getTokenAddressFromId(tokenIdWithNetwork)
    try {
      const toChecksumToken = web3.utils.toChecksumAddress(tokenAddress)
      const checkTokenChecksum = web3.utils.checkAddressChecksum(toChecksumToken)
      if (!checkTokenChecksum) {
        token = null
      }
    } catch {
      console.log('No such token', { token: tokenIdWithNetwork })
      token = null
    }

    token = tokenIdWithNetwork
  }

  if (token) {
    currentToken = await getTokenDetails(token)
  }

  if (!currentToken) {
    currentToken = await getTopToken()
  }

  const settledTokens = await storeTokens({ currentToken, Web3Account })
  quoteToken = settledTokens.quoteToken

  if (quoteToken) {
    gtmService.v3.viewProductDetails(currentToken, quoteToken)
    gtmService.v4.viewProductDetails(currentToken, quoteToken)
  }

  store.dispatch(actions.setLoading(false))

  return currentToken
}

export const updateTokenData = (currentToken: Token) => async () => {
  if (!currentToken) {
    return
  }

  const [id, network] = currentToken.id.split('-')
  const response = await getTokenFromApi(id, network)
  const icon = await getIconToken(id, network)
  const token = { ...response, icon: icon }
  if (response && token.id === currentToken.id) {
    store.dispatch(actions.setCurrentToken(response))
  }
}

export const getListTokensBySymbol = async (symbol: string, network: string): Promise<any> => {
  if (symbol === '') return []

  const response = await apiFetch(`${dexGuruAPIUrl}/tokens/search/${symbol}?network=${network}`)
  return response?.data
}
