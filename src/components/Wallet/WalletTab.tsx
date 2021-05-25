import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { WBNB_ADDRESS, WETH_ADDRESS } from '../../config/tokens'
import { balancesAPIUrl, balancesAPIKey } from '../../config/settings'
import { BigNumber } from 'bignumber.js'
import { useWeb3React } from '@web3-react/core'
import Loader from '../Loader'
import WalletRow from './WalletRow'
import WalletRowMobile from './WalletRowMobile'
import DropdownSearchWalletHead from '../DropdownSearchWalletHead'
import { State } from '../../reducers'
import { TokenInWallet, TokenNetwork } from '../../index'

// @ts-ignore TODO upgrade to 4.X, types deprecated on this verison and 4 is incompatible
import io from 'socket.io-client'
import { getTokenInfo } from '../../services/tokenService'

const io_options = {
  transports: ['websocket'],
  query: { api_token: balancesAPIKey },
}

let socket: any
window.onload = () => {
  socket = io(balancesAPIUrl, io_options)
  socket.on('connect', () => {
    socket.on('connect_error', console.error)
  })
}

interface WalletTabProps {
  searchHide: () => void
  setSearchSymbol: (searchSymbol: string) => void
}

export default function WalletTab(props: WalletTabProps) {
  const [ethTokens, setEthTokens] = useState<TokenInWallet[]>([])
  const [bscTokens, setBscTokens] = useState<TokenInWallet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [optionWallet, setOptionWallet] = useState('0')
  const isMobile = useSelector((state: State) => state.isMobile)
  const activeTradeType = useSelector((state: State) => state.activeTradeType)
  const txn = useSelector((state: State) => state.txn[activeTradeType])
  const { account } = useWeb3React()
  const balanceRequest = {
    payload: {
      address: account,
      currency: 'usd',
    },
    scope: ['assets', 'bsc-assets'],
  }

  const onReceivedAssets = async (resp: any) => {
    setIsLoading(true)
    if (resp.meta.status !== 'ok') return
    const assets = resp.payload[Object.keys(resp.payload)[0]]
    const tokens: Partial<TokenInWallet>[] = []
    let address
    for (address in assets) {
      const assetPayload = assets[address]
      const decimals = assetPayload.asset.decimals
      const balance = new BigNumber(assetPayload.quantity).dividedBy(10 ** decimals)
      const price = assetPayload.asset.price || null
      const priceUSD = price?.value || assetPayload.asset.value || undefined
      const value = priceUSD && balance.multipliedBy(priceUSD).toNumber()
      if (value > 10) {
        const network: TokenNetwork =
          Object.keys(resp.payload)[0] === 'assets'
            ? 'eth'
            : Object.keys(resp.payload)[0] === 'bsc-assets'
            ? 'bsc'
            : 'eth'
        tokens.push({
          id:
            assetPayload.asset.asset_code === 'eth'
              ? `${WETH_ADDRESS}-eth`
              : Object.keys(resp.payload)[0] === 'bsc-assets' &&
                assetPayload.asset.asset_code === '0xb8c77482e45f1f44de1745f52c74426c631bdd52' // Here balance of BNB on BSC has key of BNB token in ETH network for some reason
              ? `${WBNB_ADDRESS}-bsc`
              : `${assetPayload.asset.asset_code}-${network}`,
          decimals: decimals,
          symbol: assetPayload.asset.symbol,
          name: assetPayload.asset.name,
          balance: balance.toNumber(),
          value: value,
          network: network,
        })
      }
    }

    const fullTokens: TokenInWallet[] = []

    await Promise.all(
      tokens.map(async (token: Partial<TokenInWallet>) => {
        const fullToken = await getTokenInfo(token.id!)

        if (fullToken) {
          fullTokens.push({ balance: 0, value: 0, ...fullToken, ...token })
        }
      })
    )

    if (Object.keys(resp.payload)[0] === 'assets') {
      setEthTokens(fullTokens)
    }
    if (Object.keys(resp.payload)[0] === 'bsc-assets') {
      setBscTokens(fullTokens)
    }
    setIsLoading(false)
  }
  useEffect(() => {
    setIsLoading(true)
    socket && socket.on('received address assets', onReceivedAssets)
    socket && socket.on('received address bsc-assets', onReceivedAssets)

    return () => {
      socket && socket.off('received address assets', onReceivedAssets)
      socket && socket.off('received address bsc-assets', onReceivedAssets)
      socket && socket.disconnect()
    }
  }, [socket])

  useEffect(() => {
    setIsLoading(true)
    requestBalance()
  }, [account])

  useEffect(() => {
    if (txn?.balanceHasChanged) {
      requestBalance()
    }
  }, [txn.balanceHasChanged, socket])

  const requestBalance = () => {
    if (socket && !socket.connected) {
      socket.connect()
    }
    socket && socket.emit('get', balanceRequest)
  }

  const walletRows = ethTokens
    .concat(bscTokens)
    .sort((a: TokenInWallet, b: TokenInWallet) => b.value - a.value)
    .map((token: TokenInWallet, index: number) =>
      isMobile ? (
        <WalletRowMobile
          token={token}
          key={index}
          searchHide={props.searchHide}
          optionWallet={optionWallet}
        />
      ) : (
        <WalletRow token={token} key={index} searchHide={props.searchHide} />
      )
    )

  return (
    <React.Fragment>
      <div className="dropdown-search__body">
        <div className="dropdown-search__wrapper">
          {isLoading ? (
            <div className="loader-place ">
              <Loader />
            </div>
          ) : (
            <React.Fragment>
              <table className="dropdown-search__table">
                <DropdownSearchWalletHead
                  optionWallet={optionWallet}
                  setOptionWallet={setOptionWallet}
                />
                <tbody className="dropdown-search__tbody">{walletRows}</tbody>
              </table>
            </React.Fragment>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}
