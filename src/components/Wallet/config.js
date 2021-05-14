import {ReactComponent as MetaMaskIcon} from '../../assets/images/icons/metamask.svg';
import {ReactComponent as TrustWalletIcon} from '../../assets/images/icons/trustwallet.svg';
import {ReactComponent as MathWalletIcon} from '../../assets/images/icons/mathwallet.svg';
import {ReactComponent as TokenPocketWalletIcon} from '../../assets/images/icons/tokenpocket.svg';
import {ReactComponent as WalletConnectIcon} from '../../assets/images/icons/walletconnect.svg';
import {ReactComponent as BinanceWalletIcon} from '../../assets/images/icons/binancechainwallet.svg';
import {ReactComponent as SafePalWalletIcon} from '../../assets/images/icons/safepalwallet.svg';
import { MetaMask,WalletConnectBsc,BSCConnector} from '../../connector';
import { ConnectorNames } from "./types";

const connectors  = [
    {
        title: "Metamask",
        icon: MetaMaskIcon,
        connector: MetaMask

    },
    {
        title: "WalletConnect",
        icon: WalletConnectIcon,
        connector: WalletConnectBsc
    },
    {
        title: "Binance Chain Wallet",
        icon: BinanceWalletIcon,
        connector: BSCConnector
    },


];

export default connectors;
export const connectorLocalStorageKey = "connectorId";
