import React, { useState } from 'react'

import Omnibox from '../Omnibox'
import WalletDesktop from '../Wallet/WalletDesktop'
import SwitchCurrency from '../SwitchCurrency'
import { useSelector } from 'react-redux'

import { financialFormat, numberWithCommas, isTitleNaN } from '../../utils'
import LogoDexGuruImg from '../../images/logo-icon.svg'
import LogoDexGuru from '../../images/logo.svg'
import SettingsIcon from '../../images/icons/setting.svg'
import Mushroom from '../../images/icons/emoji/mushroom.svg'
import classNames from 'classnames'

export default function HeaderDesktop(props) {
  const activeToken = useSelector((state) => state.currentToken)
  const [isActiveSearch, setActiveSearch] = useState(false)

  const txn = useSelector((state) => state.txn)

  return (
    <React.Fragment>
      <div className="header">
        <div className="header__logo">
          <a href="/" className="logo">
            <LogoDexGuruImg className="logo__icon" />
            <h3 className="logo__text">
              crypto
            </h3>
          </a>
        </div>
        <div className="header__omnibox">
          <Omnibox
            openProviderMenu={props.openProviderMenu}
            isActiveSearch={isActiveSearch}
            setActiveSearch={setActiveSearch}
          />
        </div>
        {txn && !txn.isLoading && (
          <div className="header__overview">
            {/*<button
              className="header__button header__button--overview"
              onClick={props.onOpenOverview}>
              <span className="icon">
                <Mushroom />
              </span>
              <span className="caption">DYOR</span>
            </button>*/}
            {/*<div className="header-transactions">
              <strong className="header-transactions__title">Transactions, 24h</strong>
              <div className="header-transactions__value">
                <span className="sum" title={isTitleNaN(numberWithCommas(activeToken['txns24h']))}>
                  {financialFormat(activeToken['txns24h'], 0)}
                </span>
                <sup
                  className={classNames('delta', 'delta--md', {
                    'delta--up': activeToken['txns24hChange'] >= 0,
                    'delta--down': activeToken['txns24hChange'] < 0,
                  })}
                  title={isTitleNaN(
                    numberWithCommas(Math.abs(activeToken['txns24hChange']) * 100, 2)
                  )}>
                  {financialFormat(Math.abs(activeToken['txns24hChange']) * 100, 2)}%
                </sup>
              </div>
            </div>*/}
          </div>
        )}
        <div className="header__personal">
          {txn && !txn.isLoading && (
            <React.Fragment>
             {/* <div className="header-personal__currency">
                <SwitchCurrency />
              </div>*/}
              {/*<div className="header-personal__action">
                <button className="header__action header__action--settings">
                  <span className="icon" onClick={props.openSettings}>
                    <SettingsIcon />
                  </span>
                </button>
              </div>*/}
            </React.Fragment>
          )}
          <div className="header-personal__wallet">
            <WalletDesktop isMobile={false} openProviderMenu={props.openProviderMenu} />
          </div>
        </div>
      </div>
      <div className={`overlay-search ${isActiveSearch ? 'show' : 'hide'}`} />
    </React.Fragment>
  )
}
