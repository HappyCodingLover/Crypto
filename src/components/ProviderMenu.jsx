import * as React from 'react'
import { useState, useEffect } from 'react'
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import {
  NoEthereumProviderError,
  UserRejectedRequestError as UserRejectedRequestErrorInjected,
} from '@web3-react/injected-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorWalletConnect } from '@web3-react/walletconnect-connector'
import { UserRejectedRequestError as UserRejectedRequestErrorFrame } from '@web3-react/frame-connector'
import { injected, walletconnect, walletconnectBsc,BSCConnector } from '../connectors'
import { useEagerConnect, useInactiveListener } from '../hooks'
import IconClose from '../images/icons/close.svg'
import { getShortAccount, setTokenToLocalStorage } from '../utils'
import { connect, useSelector } from 'react-redux'
import { providers } from '../config/providers'
import classNames from 'classnames'

const connectorsByName = {
  MetaMask: injected,
  TrustWallet: injected,
  /*WalletConnect: walletconnect,*/
  WalletConnectBinance: walletconnectBsc,
  BinanceChainWallet:BSCConnector
}

function getErrorMessage(error) {
  if (error instanceof NoEthereumProviderError) {
    return 'No Ethereum browser extension detected, install MetaMask on desktop or visit from a dApp browser on mobile.'
  } else if (error instanceof UnsupportedChainIdError) {
    return "You're connected to an unsupported network."
  } else if (
    error instanceof UserRejectedRequestErrorInjected ||
    error instanceof UserRejectedRequestErrorWalletConnect ||
    error instanceof UserRejectedRequestErrorFrame
  ) {
    return 'Please authorize this website to access your Ethereum account.'
  } else {
    console.error(error)
    return 'An unknown error occurred. Check the console for more details.'
  }
}

export function ProviderMenu(props) {
  const isMobile = window.innerWidth <= 1200
  const { connector, activate, deactivate, active, error, account } = useWeb3React()
  const activeToken = useSelector((state) => state.currentToken)
  // handle logic to recognize the connector currently being activated
  const [activatingConnector, setActivatingConnector] = useState()

  useEffect(() => {
    if (activatingConnector && activatingConnector === connector) {
      setActivatingConnector(undefined)
    }
    const currentToken = activeToken.id
    setTokenToLocalStorage(currentToken, account)
  }, [activatingConnector, connector, account, activeToken.id])

  // handle logic to eagerly connect to the injected ethereum provider, if it exists and has granted access already
  const triedEager = useEagerConnect()

  // handle logic to connect in reaction to certain events on the injected ethereum provider, if it exists
  useInactiveListener(!triedEager || !!activatingConnector)

  return (
    <React.Fragment>
      <div className={classNames('provider-menu', { mobile: props.isMobile })}>
        {props.closeProviderMenu && (
          <div className="close-modal" onClick={props.closeProviderMenu}>
            <IconClose />
          </div>
        )}
        <div className="title-modal">Select Wallet Provider</div>
        <div className="content">
          <div className="provider-menu-list">
            {Object.keys(connectorsByName).map((provider) => {
              if (!isMobile && provider === 'TrustWallet') {
                return null
              }
              const currentConnector = connectorsByName[provider]
              const activating = currentConnector === activatingConnector
              const connected = currentConnector === connector
              const ProviderLogo = providers[provider].reactLogo
              return (
                <button
                  className={`${connected ? 'active' : ''} ${
                    provider === 'WalletConnectBinance' && 'bsc'
                  }`}
                  key={provider}
                  onClick={async () => {
                    setActivatingConnector(currentConnector)
                    if (currentConnector !== connectorsByName.WalletConnect) {
                      await connectorsByName.WalletConnect.close()
                    }
                    if (currentConnector !== connectorsByName.WalletConnectBinance) {
                      await connectorsByName.WalletConnectBinance.close()
                    }

                    activate(currentConnector, console.error)
                    props.closeProviderMenu()
                  }}>
                  <div className="logo">
                    <ProviderLogo />
                  </div>
                  <div className="details">
                    <span className="name">{providers[provider].name}</span>
                    <span className="account">
                      {connected && account && getShortAccount(account)}
                    </span>
                  </div>
                  {activating && <div>...</div>}
                </button>
              )
            })}
          </div>

          {!!error && <p className="error">{getErrorMessage(error)}</p>}

          <div className="disclaimer">
            By connecting wallet you agree to the{' '}
            <a
              href="https://docs.dex.guru/legal/terms-of-service"
              target="_blank"
              rel="noopener noreferrer">
              Terms of Service
            </a>{' '}
            and{' '}
            <a
              href="https://docs.dex.guru/legal/privacy-policy"
              target="_blank"
              rel="noopener noreferrer">
              Privacy Policy
            </a>
          </div>

          {(active || error) && (
            <button
              className="disconnect"
              onClick={async () => {
                if (connectorsByName.WalletConnect === connector) {
                  await connectorsByName.WalletConnect.close()
                }
                if (connectorsByName.WalletConnectBinance === connector) {
                  await connectorsByName.WalletConnectBinance.close()
                }
                walletconnect?.close()
                walletconnectBsc?.close()
                deactivate()
              }}>
              Disconnect
            </button>
          )}
        </div>
      </div>
    </React.Fragment>
  )
}

const mapStateToProps = (state) => {
  return {
    isMobile: state.isMobile,
  }
}

export default connect(mapStateToProps)(ProviderMenu)
