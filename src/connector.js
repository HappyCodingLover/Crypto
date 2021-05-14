import { InjectedConnector } from '@web3-react/injected-connector'
import { WalletConnectConnector } from '@web3-react/walletconnect-connector';
import { BscConnector } from '@binance-chain/bsc-connector';

export const supportedChainIds = [1, 56,97];

export const MetaMask = new InjectedConnector({supportedChainIds:supportedChainIds})
export const BSCConnector = new BscConnector();


const RPC_URL_BSC_MAINNET = 'https://bsc-dataseed.binance.org/';
const POLLING_INTERVAL = 3600000
const rpcUrls = {
    56: RPC_URL_BSC_MAINNET,
}
export const WalletConnectBsc = new WalletConnectConnector({
    rpc: { 56: rpcUrls[56] },
    bridge: 'https://bridge.walletconnect.org',
    qrcode: true,
    pollingInterval: POLLING_INTERVAL,
});

