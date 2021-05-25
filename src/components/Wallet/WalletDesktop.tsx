import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import WalletIcon from '../../images/icons/wallet.svg'
import { getShortAccount, getNetworkByChainId } from '../../utils'
import { useWeb3React } from '@web3-react/core'
// @ts-ignore missing types
import Jazzicon from 'jazzicon'
import { blockExplorerUrls, walletUrls } from '../../config/settings'
import classNames from 'classnames'
import { State } from '../../reducers'

interface WalletDesktopProps {
  openProviderMenu: () => void
}

export default function WalletDesktop(props: WalletDesktopProps) {
  const activeTradeType = useSelector((store: State) => store.activeTradeType)
  const txn = useSelector((state: State) => state.txn[activeTradeType])
  const accountRef = useRef<any>(null)
  const { account, chainId } = useWeb3React()

  const networkName = getNetworkByChainId(chainId)

  useEffect(() => {
    if (account && accountRef.current) {
      accountRef.current.innerHTML = ''
      const icon = Jazzicon(24, parseInt(account.slice(2, 10), 16))
      icon.style.removeProperty('margin')
      icon.style.removeProperty('width')
      icon.style.removeProperty('height')
      icon.classList.add('token-ico__image')
      icon.classList.add(networkName)
      accountRef.current.appendChild(icon)
    }
  }, [account])

  return (
    <React.Fragment>
      <div
        className={classNames(
          'wallet',
          { 'wallet--open': account },
          { 'wallet--loading': txn && txn.isLoading }
        )}>
        <div
          className={classNames(
            'wallet__icon',
            networkName ? `wallet__icon--network-${networkName}` : ''
          )}
          onClick={props.openProviderMenu}>
          {networkName && networkName !== 'eth' && (
            <span className="network">{networkName.toUpperCase()}</span>
          )}{' '}
          <span className="icon">
            <WalletIcon />
          </span>
        </div>
        <div className={classNames('wallet__data', { 'wallet__data--show': !!account })}>
          {txn && !txn.isLoading ? (
            <a
              href={`${walletUrls[networkName || 'eth']}${account}/overview`}
              className="wallet__txn"
              target="_blank"
              rel="noopener noreferrer">
              {account && getShortAccount(account)}
            </a>
          ) : (
            <a
              href={`${blockExplorerUrls[networkName || 'eth']}/tx/${txn.hashTxn}`}
              className="wallet__txn"
              target="_blank"
              rel="noopener noreferrer">
              TX Pending
            </a>
          )}
          <div
            className={classNames('wallet__avatar', 'token-ico', 'token-ico--sm')}
            ref={accountRef}
          />
        </div>
      </div>
    </React.Fragment>
  )
}
