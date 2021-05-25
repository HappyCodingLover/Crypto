import React, { useState } from 'react'

import Omnibox from '../Omnibox'
import WalletMobile from '../Wallet/WalletMobile'
import SwitchCurrency from '../SwitchCurrency'

import LogoDexGuruImg from '../../images/logo-icon.svg'
import LogoDexGuru from '../../images/logo.svg'
import SettingsIcon from '../../images/icons/setting.svg'
import IconClose from '../../images/icons/close.svg'
import classNames from 'classnames'

interface HeaderProps {
  version?: string
  isInDashboard: boolean
  isSettingsOpen: boolean
  openProviderMenu: () => void
  onOpenSettings: () => void
  isOpenProviderMenu: boolean
  onClose: () => void
}

export default function Header(props: HeaderProps) {
  const [isActiveSearch, setActiveSearch] = useState(false)

  return (
    <React.Fragment>
      <div
        className={classNames(
          'header header--mobile',
          { 'header--settings': props.isSettingsOpen },
          {
            'header--provider': props.isOpenProviderMenu,
          }
        )}>
        <div className="header__logo">
          <a href="/" className="logo">
            <LogoDexGuruImg className="logo__icon" />
            {!props.isInDashboard && <LogoDexGuru className="logo__text" />}
          </a>
        </div>
        <div className="header__omnibox">
          {props.isInDashboard && (
            <Omnibox
              openProviderMenu={props.openProviderMenu}
              isActiveSearch={isActiveSearch}
              setActiveSearch={setActiveSearch}
            />
          )}

          <div
            className={classNames('omnibox-overlay', { 'omnibox-overlay--show': isActiveSearch })}
          />
        </div>
        <div className="header__personal">
          {props.isInDashboard && (
            <React.Fragment>
              <SwitchCurrency />
              <WalletMobile openProviderMenu={props.openProviderMenu} />
              <div className="header__settings icon" onClick={props.onOpenSettings}>
                <SettingsIcon />
              </div>
            </React.Fragment>
          )}
        </div>
        {props.version && <div className="header__version">{props.version}</div>}
        {!props.isInDashboard && (
          <div className="close-mobile-screen" onClick={props.onClose}>
            <IconClose />
          </div>
        )}
      </div>
    </React.Fragment>
  )
}
