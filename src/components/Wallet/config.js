import {ReactComponent as MetaMaskIcon} from '../../assets/images/icons/metamask.svg';
import {ReactComponent as TrustWalletIcon} from '../../assets/images/icons/trustwallet.svg';
import {ReactComponent as MathWalletIcon} from '../../assets/images/icons/mathwallet.svg';
import {ReactComponent as TokenPocketWalletIcon} from '../../assets/images/icons/tokenpocket.svg';
import {ReactComponent as WalletConnectIcon} from '../../assets/images/icons/walletconnect.svg';
import {ReactComponent as BinanceWalletIcon} from '../../assets/images/icons/binancechainwallet.svg';
import {ReactComponent as SafePalWalletIcon} from '../../assets/images/icons/safepalwallet.svg';

import { ConnectorNames } from "./types";

const connectors  = [
    {
        title: "Metamask",
        icon: MetaMaskIcon,
        connectorId: ConnectorNames.Injected,
    },
    {
        title: "TrustWallet",
        icon: TrustWalletIcon,
        connectorId: ConnectorNames.Injected,
    },
    {
        title: "MathWallet",
        icon: MathWalletIcon,
        connectorId: ConnectorNames.Injected,
    },
    {
        title: "TokenPocket",
        icon: TokenPocketWalletIcon,
        connectorId: ConnectorNames.Injected,
    },
    {
        title: "WalletConnect",
        icon: WalletConnectIcon,
        connectorId: ConnectorNames.WalletConnect,
    },
    {
        title: "Binance Chain Wallet",
        icon: BinanceWalletIcon,
        connectorId: ConnectorNames.BSC,
    },
    {
        title: "SafePal Wallet",
        icon: SafePalWalletIcon,
        connectorId: ConnectorNames.Injected,
    },
];

export default connectors;
export const connectorLocalStorageKey = "connectorId";
