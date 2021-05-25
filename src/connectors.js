import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { infuraApiKey } from './config/settings'

const RPC_URL_ETH_MAINNET = 'https://mainnet.infura.io/v3/' + infuraApiKey
const RPC_URL_BSC_MAINNET = 'https://bsc-dataseed.binance.org/'
const POLLING_INTERVAL = 3600000

const rpcUrls = {
  1: RPC_URL_ETH_MAINNET,
  56: RPC_URL_BSC_MAINNET,
}

export const supportedChainIds = [56,97]

export const injected = new InjectedConnector({ supportedChainIds: supportedChainIds })

import { BscConnector } from '@binance-chain/bsc-connector';
export const BSCConnector = new BscConnector();

export const walletconnect = new WalletConnectConnector({
  rpc: { 1: rpcUrls[1] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

export const walletconnectBsc = new WalletConnectConnector({
  rpc: { 56: rpcUrls[56] },
  bridge: 'https://bridge.walletconnect.org',
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

export const walletConnectFactory = (chainId) =>
  new WalletConnectConnector({
    rpc: { [chainId]: rpcUrls[chainId] },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
  })
