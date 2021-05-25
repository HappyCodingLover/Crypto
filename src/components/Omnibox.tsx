import React, { useState, useEffect, useRef } from 'react'
import { financialFormat, numberWithCommas, isTitleNaN, getShortNameToken } from '../utils'
import OutsideClicker from './OutsideClicker'
import DropdownSearch from './DropdownSearch'
import { useDispatch, useSelector } from 'react-redux'
import { useDebounce } from 'use-debounce'
import classNames from 'classnames'
import IconTokenComponent from './IconTokenComponent'

// @ts-ignore
import Favorite from '../images/icons/emoji/favorite.svg'
// @ts-ignore
import IconClose from '../images/icons/close.svg'
// @ts-ignore
import SearchIcon from '../images/icons/search.svg'
import { Token, TokenIcon } from '..'
import { addFavorite, removeFavorite } from '../actions'
import { State } from '../reducers'

interface OmniboxProps {
  setActiveSearch: (value: boolean) => void
  isActiveSearch: boolean
  openProviderMenu: () => void
}

export default function Omnibox(props: OmniboxProps) {
  const searchQueryRef = useRef<any>()

  const activeToken: Token = useSelector((state: State) => state.currentToken)
  const selectedCurrency = useSelector((state: State) => state.currency)
  const isMobile = useSelector((state: State) => state.isMobile)
  const [searchSymbol, setSearchSymbol] = useState('')

  const [IconToken, setIconToken] = React.useState<TokenIcon>(null)
  const [isFavoritesToken, setFavoritesToken] = useState<boolean>(false)
  const [debouncedText] = useDebounce(searchSymbol, 500)
  const favorites: Token[] = useSelector((store: State) => store.favorites)
  const reduxDispatch = useDispatch()

  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      if (event.code === 'Backquote' || event.code === 'IntlBackslash') {
        // pressed: ~ §
        if (!document.querySelector('.omnibox-search__query:focus')) {
          event.preventDefault()
          setSearchSymbol('')
          searchFocus()
        }
      }

      if (event.code === 'Escape') {
        // pressed: ESC
        setSearchSymbol('')
        searchHide()
        searchQueryRef.current.blur()
      }
    }
    window.addEventListener('keydown', handleKeys)

    return () => {
      window.removeEventListener('keydown', handleKeys)
    }
  }, [])

  useEffect(() => {
    getTokenIcons()

    searchQueryRef.current.placeholder = !isMobile ? 'Search Market' : ''
  }, [activeToken.id])

  useEffect(() => {
    const isFavorite = favorites.some((t: Token) => t.id === activeToken.id) || false
    setFavoritesToken(isFavorite)
  }, [activeToken.id, favorites.length])

  const getTokenIcons = async () => {
    if (activeToken.icon) {
      const tokenIcon = activeToken.icon
      setIconToken(tokenIcon)
    }
  }

  const searchShow = () => {
    searchFocus()
  }

  const searchHide = () => {
    props.setActiveSearch(false)
    setSearchSymbol('')
    searchQueryRef.current.placeholder = !isMobile ? 'Search Market' : ''
    searchQueryRef.current.blur()
  }

  const searchFocus = () => {
    props.setActiveSearch(true)
    searchQueryRef.current.placeholder = 'Search Market, use ticker or token address'
    searchQueryRef.current.focus()
  }

  const onChange = (e: any) => {
    setSearchSymbol(e.target.value)
  }

  const onFocus = () => {
    searchFocus()
  }

  const onClickFavoriteIcon = () => {
    const wasTokenFavorite = favorites?.find((t: Token) => t.id === activeToken.id) || false
    if (wasTokenFavorite) {
      reduxDispatch(removeFavorite(activeToken))
    } else {
      reduxDispatch(addFavorite(activeToken))
    }

    setFavoritesToken(!wasTokenFavorite)
  }

  return (
    <div className={classNames('omnibox', { 'omnibox--open': props.isActiveSearch })}>
      {isMobile && (
        <div className="close-market" onClick={searchHide}>
          <IconClose />
        </div>
      )}

      <div className="omnibox__token omnibox-token" onClick={searchShow}>
        {!isMobile && (
          <span
            className={classNames('omnibox-token__favourite icon', {
              'omnibox-token__favourite--active': isFavoritesToken,
            })}
            onClick={onClickFavoriteIcon}>
            <Favorite />
          </span>
        )}
        <div
          className={classNames(
            'omnibox-token__image',
            'token-ico',
            { 'token-ico--sm': isMobile },
            activeToken.network ? `token-ico--network-${activeToken.network}` : ''
          )}>
          <IconTokenComponent
            IconToken={IconToken}
            symbol={activeToken.symbol}
            className="token-ico__image"
          />
        </div>
        <span className="omnibox-token__name" title={`${activeToken.symbol}`}>
          <span className="title">{`${getShortNameToken(activeToken)}`}</span>
          {activeToken.network !== 'eth' && (
            <span className={`network network--${activeToken.network}`}>
              &nbsp;{activeToken.network.toUpperCase()}
            </span>
          )}
        </span>
        <div className="omnibox-token__data">
          <div className="omnibox-token__value">
            {selectedCurrency === 'USD' && <span className="sign">$</span>}
            {selectedCurrency === 'USD' ? (
              <span title={isTitleNaN(numberWithCommas(activeToken.priceUSD))}>
                {financialFormat(activeToken.priceUSD)}
              </span>
            ) : (
              <span title={isTitleNaN(numberWithCommas(activeToken.priceETH))}>
                {financialFormat(activeToken.priceETH)}
              </span>
            )}
            {selectedCurrency !== 'USD' && <span className="sign">&nbsp;{selectedCurrency}</span>}
          </div>
          <div className="omnibox-token__delta">
            <sup
              className={classNames(
                'delta',
                { 'delta--md': !isMobile },
                { 'delta--sm': isMobile },
                {
                  'delta--up': activeToken['priceChange24h'] >= 0,
                  'delta--down': activeToken['priceChange24h'] < 0,
                }
              )}
              title={isTitleNaN(numberWithCommas(Math.abs(activeToken['priceChange24h']) * 100))}>
              {financialFormat(Math.abs(activeToken['priceChange24h']) * 100, 2)}%
            </sup>
          </div>
        </div>
      </div>

      <OutsideClicker
        clickHide={searchHide}
        isActiveSearch={props.isActiveSearch}
        className="omnibox__search">
        <React.Fragment>
          <div className="omnibox-search">
            <input
              className="omnibox-search__query"
              placeholder="Search Market"
              onFocus={onFocus}
              onChange={onChange}
              value={searchSymbol}
              ref={searchQueryRef}
            />
            <button
              className="omnibox-search__action omnibox-search__action--submit"
              onClick={searchShow}>
              <div className="icon">
                <SearchIcon />
              </div>
            </button>
            {!isMobile && (
              <React.Fragment>
                <span className="omnibox-search__hint">
                  <kbd>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="10" height="12">
                      <path stroke="#fff" d="M5 12V1m0 0L1 5m4-4l4 4" />
                    </svg>
                  </kbd>
                </span>
                <span className="omnibox-search__hint">
                  <kbd>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" width="10" height="12">
                      <path stroke="#fff" d="M5 0v11m0 0l4-4m-4 4L1 7" />
                    </svg>
                  </kbd>
                </span>
                <span
                  className="omnibox-search__hint omnibox-search__hint--close"
                  onClick={searchHide}>
                  <kbd>
                    <small>ESC</small>
                  </kbd>
                </span>
                <span
                  className="omnibox-search__hint omnibox-search__hint--open"
                  onClick={searchShow}>
                  <kbd>~</kbd>
                </span>
              </React.Fragment>
            )}
          </div>
          <div className="omnibox-search__dropdown">
            <DropdownSearch
              isActiveSearch={props.isActiveSearch}
              searchHide={searchHide}
              debouncedText={debouncedText}
              setSearchSymbol={setSearchSymbol}
              openProviderMenu={props.openProviderMenu}
            />
          </div>
        </React.Fragment>
      </OutsideClicker>
    </div>
  )
}
