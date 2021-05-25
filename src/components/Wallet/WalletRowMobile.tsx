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

import { State } from '../../reducers'
import { TokenIcon, TokenInWallet } from '../../index'
import { getIconToken } from '../../services/iconService'
import { setCurrentToken } from '../../services/tokenService'

interface WalletRowProps {
  searchHide: () => void
  token: TokenInWallet
  optionWallet: string
}

function WalletRow(props: WalletRowProps) {
  const [iconToken, setIconToken] = useState<TokenIcon>(null)
  const { account } = useWeb3React()
  let token = props.token
  const tokenNetwork = token.network

  useEffect(() => {
    getTokenIcons()
  }, [token])

  const getTokenIcons = async () => {
    const tokenIcon = await getIconToken(getTokenAddressFromId(token), tokenNetwork)
    setIconToken(tokenIcon)
  }

  const selectedToken = async () => {
    props.searchHide()

    if (iconToken) {
      token = { ...token, icon: iconToken }
    }

    setCurrentToken(token, account)
  }

  const { ethPrice } = useSelector((state: State) => state.tokenPriceUSD)
  const selectedCurrency = useSelector((state: State) => state.currency)

  return (
    <tr className="dropdown-search__trow token" onClick={selectedToken}>
      <td className="token__icon">
        <div className={`token-ico token-ico--network-${props.token.network}`}>
          <IconTokenComponent
            IconToken={iconToken}
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

      {props.optionWallet === '0' && (
        <React.Fragment>
          <td className="null" onClick={selectedToken} />
          <td className="token__liquidity" onClick={selectedToken}>
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
        </React.Fragment>
      )}

      {props.optionWallet === '1' && (
        <React.Fragment>
          <td className="token__price" onClick={selectedToken}>
            <span
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
            </span>
          </td>
          <td className="token__price-delta" onClick={selectedToken}>
            <sup
              className={classNames('delta', 'delta--sm', {
                'delta--up': props.token.priceChange24h >= 0,
                'delta--down': props.token.priceChange24h < 0,
              })}
              title={isTitleNaN(numberWithCommas(Math.abs(props.token.priceChange24h)))}>
              {financialFormat(Math.abs(props.token.priceChange24h), 2)}%
            </sup>
          </td>
        </React.Fragment>
      )}
    </tr>
  )
}

export default WalletRow
