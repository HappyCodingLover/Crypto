import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import {
  financialFormat,
  numberWithCommas,
  isTitleNaN,
  replaceWrapperTokenToToken,
  getTokenAddressFromId,
} from '../../utils'
import { useSelector } from 'react-redux'
import IconTokenComponent from '../IconTokenComponent'
import classNames from 'classnames'

import { TokenIcon, TokenInWallet } from '../../index'
import { State } from '../../reducers'
import { getIconToken } from '../../services/iconService'
import { setCurrentToken } from '../../services/tokenService'

interface WalletRowProps {
  token: TokenInWallet
  searchHide: () => void
}

function WalletRow(props: WalletRowProps) {
  const [IconToken, setIconToken] = useState<TokenIcon>(null)
  const context = useWeb3React()
  let token = props.token
  const tokenNetwork = token.network

  useEffect(() => {
    getTokenIcons()
  }, [token?.id])

  const getTokenIcons = async () => {
    const tokenIcon = await getIconToken(getTokenAddressFromId(token), tokenNetwork)
    setIconToken(tokenIcon)
  }

  const selectedToken = async () => {
    props.searchHide()
    token = { ...token, icon: IconToken }
    setCurrentToken(token, context.account)
  }

  const { ethPrice } = useSelector((state: State) => state.tokenPriceUSD)
  const selectedCurrency = useSelector((state: State) => state.currency)

  return (
    <tr className="dropdown-search__trow token" onClick={selectedToken}>
      <td className="token__icon">
        <div className={`token-ico token-ico--network-${props.token.network}`}>
          <IconTokenComponent
            IconToken={IconToken}
            symbol={props.token.symbol}
            className="token-ico__image"
          />
        </div>
      </td>
      <td className="token__name">
        <span className="token__name-string">
          <span className="title" title={replaceWrapperTokenToToken(token.symbol)}>
            {replaceWrapperTokenToToken(token.symbol)}
          </span>
          {token.network !== 'eth' && (
            <span className={`network network--${token.network}`}>
              &nbsp;{token.network.toUpperCase()}
            </span>
          )}
        </span>
      </td>
      <td className="token__balance">
        <span title={replaceWrapperTokenToToken(token.symbol)}>
          {financialFormat(token.balance, 4)}
        </span>
      </td>
      <td className="token__value">
        <div
          className="sum-part"
          title={isTitleNaN(
            selectedCurrency === 'USD'
              ? numberWithCommas(props.token.value)
              : numberWithCommas(props.token.value / ethPrice)
          )}>
          {selectedCurrency === 'USD' && <span className="sign">$</span>}
          {selectedCurrency === 'USD'
            ? financialFormat(Number(props.token.value), 2)
            : financialFormat(Number(props.token.value) / ethPrice, 2)}
          {selectedCurrency !== 'USD' && <span className="sign">&nbsp;{selectedCurrency}</span>}
        </div>
      </td>
      <td className="token__price">
        <div
          className="sum-part"
          title={isTitleNaN(
            selectedCurrency === 'USD'
              ? numberWithCommas(props.token.priceUSD)
              : numberWithCommas(props.token.priceUSD / ethPrice)
          )}>
          {selectedCurrency === 'USD' && <span className="sign">$</span>}
          {selectedCurrency === 'USD'
            ? financialFormat(Number(props.token.priceUSD))
            : financialFormat(Number(props.token.priceUSD) / ethPrice)}
          {selectedCurrency !== 'USD' && <span className="sign">&nbsp;{selectedCurrency}</span>}
        </div>
      </td>
      <td className="token__price-delta">
        <sup
          className={classNames('delta', 'delta--md', {
            'delta--up': props.token.priceChange24h >= 0,
            'delta--down': props.token.priceChange24h < 0,
          })}
          title={isTitleNaN(numberWithCommas(Math.abs(props.token.priceChange24h * 100)))}>
          {financialFormat(Math.abs(props.token.priceChange24h) * 100, 2)}%
        </sup>
      </td>
    </tr>
  )
}

export default WalletRow
