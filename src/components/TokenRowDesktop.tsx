import React, { useState } from 'react'
import { useWeb3React } from '@web3-react/core'
import Favorite from '../images/icons/emoji/favorite.svg'
import { useDispatch } from 'react-redux'
import { financialFormat, numberWithCommas, isTitleNaN, getTokenAddressFromId } from '../utils'
import { useSelector } from 'react-redux'

import { replaceWrapperTokenToToken } from '../utils'
import IconTokenComponent from './IconTokenComponent'
import classNames from 'classnames'
import { Token, TokenIcon } from '../index'
import { addFavorite, removeFavorite } from '../actions'
import { getIconToken } from '../services/iconService'
import { setCurrentToken } from '../services/tokenService'

interface TokenRowDesktopProps {
  token: Token
  searchHide: () => void
}

const TokenRowDesktop = (props: TokenRowDesktopProps) => {
  const [isFavoriteToken, setFavoriteToken] = useState<boolean>(false)
  const [IconToken, setIconToken] = React.useState<TokenIcon>(null)

  let token = props.token

  const selectedCurrency = useSelector((state: any) => state.currency)
  const { account } = useWeb3React()

  const reduxDispatch = useDispatch()
  const favorites: Token[] = useSelector((store: any) => store.favorites)

  const selectToken = async () => {
    props.searchHide()
    token = { ...token, icon: IconToken }
    setCurrentToken(token, account)
  }

  React.useEffect(() => {
    getTokenIcons()
  }, [token])

  React.useEffect(() => {
    const isFavorite = favorites.some((t: Token) => t.id === props.token.id) || false
    setFavoriteToken(isFavorite)
  }, [favorites.length])

  const getTokenIcons = async () => {
    const tokenIcon = await getIconToken(getTokenAddressFromId(token), token.network)
    setIconToken(tokenIcon)
  }

  const onClickFavoriteToken = () => {
    const wasTokenFavorite = favorites.find((t: Token) => t.id === props.token.id) || false
    if (wasTokenFavorite) {
      reduxDispatch(removeFavorite(token))
    } else {
      reduxDispatch(addFavorite(token))
    }

    setFavoriteToken(!wasTokenFavorite)
  }

  return (
    <tr className="dropdown-search__trow token">
      <td
        className={classNames('token__favorite', { favorite: isFavoriteToken })}
        onClick={onClickFavoriteToken}>
        <span className="icon">
          <Favorite />
        </span>
      </td>
      <td className="token__icon" onClick={selectToken}>
        <div className={`token-ico token-ico--network-${props.token.network}`}>
          <IconTokenComponent
            IconToken={IconToken}
            symbol={props.token.symbol}
            className="token-ico__image"
          />
        </div>
      </td>
      <td className="token__name" onClick={selectToken}>
        <span className="token__name-string">
          <span className="title" title={replaceWrapperTokenToToken(token.symbol)}>
            {replaceWrapperTokenToToken(token.symbol)}
          </span>
          {token.network && token.network !== 'eth' && (
            <span className={`network network--${token.network}`}>
              &nbsp;{token.network.toUpperCase()}
            </span>
          )}
        </span>
      </td>
      <td className="token__volume" onClick={selectToken}>
        <div
          className="sum-part"
          title={isTitleNaN(
            selectedCurrency === 'USD'
              ? numberWithCommas(props.token['volume24hUSD'])
              : numberWithCommas(props.token['volume24hETH'])
          )}>
          {selectedCurrency === 'USD' && <span className="sign">$</span>}
          {selectedCurrency === 'USD'
            ? financialFormat(props.token['volume24hUSD'], 0)
            : financialFormat(props.token['volume24hETH'], 0)}
          {selectedCurrency !== 'USD' && <span className="sign">&nbsp;{selectedCurrency}</span>}
        </div>
      </td>
      <td className="token__liquidity" onClick={selectToken}>
        <div
          className="sum-part"
          title={isTitleNaN(
            selectedCurrency === 'USD'
              ? numberWithCommas(props.token.liquidityUSD)
              : numberWithCommas(props.token.liquidityETH)
          )}>
          {selectedCurrency === 'USD' && <span className="sign">$</span>}
          {selectedCurrency === 'USD'
            ? financialFormat(props.token.liquidityUSD, 0)
            : financialFormat(props.token.liquidityETH, 0)}
          {selectedCurrency !== 'USD' && <span className="sign">&nbsp;{selectedCurrency}</span>}
        </div>
      </td>
      <td className="token__price" onClick={selectToken}>
        <div
          className="sum-part"
          title={isTitleNaN(
            selectedCurrency === 'USD'
              ? numberWithCommas(props.token.priceUSD)
              : numberWithCommas(props.token.priceETH)
          )}>
          {selectedCurrency === 'USD' && <span className="sign">$</span>}
          {selectedCurrency === 'USD'
            ? financialFormat(props.token.priceUSD)
            : financialFormat(props.token.priceETH)}
          {selectedCurrency !== 'USD' && <span className="sign">&nbsp;{selectedCurrency}</span>}
        </div>
      </td>
      <td className="token__price-delta" onClick={selectToken}>
        <sup
          className={classNames('delta', 'delta--md', {
            'delta--up': props.token['priceChange24h'] >= 0,
            'delta--down': props.token['priceChange24h'] < 0,
          })}
          title={isTitleNaN(numberWithCommas(Math.abs(props.token['priceChange24h']) * 100))}>
          {financialFormat(Math.abs(props.token['priceChange24h']) * 100, 2)}%
        </sup>
      </td>
    </tr>
  )
}

export default TokenRowDesktop
