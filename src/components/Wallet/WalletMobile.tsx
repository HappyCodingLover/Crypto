import React, { useRef, useEffect } from 'react'
import { useSelector } from 'react-redux'
import WalletIcon from '../../images/icons/wallet.svg'
import { getNetworkByChainId } from '../../utils'
import { useWeb3React } from '@web3-react/core'
// @ts-ignore missing types
import Jazzicon from 'jazzicon'
import classNames from 'classnames'
import { State } from '../../reducers'

interface WalletMobileProps {
  openProviderMenu: () => void
}

export default function WalletMobile(props: WalletMobileProps) {
  const activeTradeType = useSelector((store: State) => store.activeTradeType)
  const txn = useSelector((state: State) => state.txn[activeTradeType])
  const accountRef = useRef<any>(null)
  const { account, chainId } = useWeb3React()

  const networkName = getNetworkByChainId(chainId)

  useEffect(() => {
    if (account && accountRef.current) {
      accountRef.current.innerHTML = ''
      const icon = Jazzicon(24, parseInt(account.slice(2, 10), 16))
      icon.style.removeProperty('border-radius')
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
      <div className={classNames('wallet', { 'wallet--open': account })}>
        {account ? (
          <div
            className={classNames(
              'wallet__avatar',
              'token-ico',
              'token-ico--xs',
              { 'token-ico--loading': txn && txn.isLoading },
              `token-ico--network-${networkName}`
            )}
            onClick={props.openProviderMenu}
            ref={accountRef}
          />
        ) : (
          <div
            className={classNames(
              'wallet__icon',
              networkName ? `wallet__icon--${networkName}` : ''
            )}
            onClick={props.openProviderMenu}>
            {networkName && networkName !== 'eth' && (
              <span className="network">{networkName.toUpperCase()}&nbsp;</span>
            )}{' '}
            <span className="icon">
              <WalletIcon />
            </span>
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
