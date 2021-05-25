import React, { useState, useEffect } from 'react'
import TokenList from './TokenList'
import DropdownSearchHead from './DropdownSearchHead'
import WalletTab from './Wallet/WalletTab'
import Loader from './Loader'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import { getSortedTokens, searchTokensBySymbol } from '../services/tokenService'
import { Token } from '..'
// @ts-ignore
import { useWeb3React } from '@web3-react/core'
import Hmm from '../images/icons/emoji/hmm.svg'
import { State } from '../reducers'
import { fetchFavorites } from '../services/preferencesService'
import { setFavorites } from '../actions'

interface DropdownSearchProps {
  debouncedText: string
  setSearchSymbol: (searchSymbol: string) => void
  isActiveSearch: boolean
  searchHide: () => void
  openProviderMenu: () => void
}

type Filter = 'up' | 'favorite' | 'wallet-tab'

export default function DropdownSearch(props: DropdownSearchProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [filter, setFilter] = useState<Filter>('up')
  const [tokens, setTokens] = useState<Token[]>([])
  const [filteredTokens, setFilteredTokens] = useState<Token[]>([])
  const [optionDropdown, setOptionDropdown] = useState('0')
  const favorites: Token[] = useSelector((store: State) => store.favorites)
  const { account } = useWeb3React()
  const reduxDispatch = useDispatch()

  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      let currentRow = document.querySelector('.dropdown-search__trow.is--selected')
      if (event.code === 'ArrowUp' || event.code === 'ArrowDown') {
        // pressed: ⬆ ⬇

        const isPrev = event.code === 'ArrowUp'

        if (!currentRow) {
          currentRow = document.querySelector('.dropdown-search__trow:first-child')
          currentRow?.classList.add('is--selected')

          return
        }

        let otherRow = currentRow[isPrev ? 'previousElementSibling' : 'nextElementSibling']

        if (!otherRow) {
          const currentTable = currentRow.closest('.dropdown-search__table')

          let table =
            currentTable && currentTable[isPrev ? 'previousElementSibling' : 'nextElementSibling']

          while (table && !table.matches('.dropdown-search__table')) {
            table = table[isPrev ? 'previousElementSibling' : 'nextElementSibling']
          }

          if (!table) {
            otherRow = currentRow
          } else {
            otherRow = table.querySelector(
              `.dropdown-search__trow:${isPrev ? 'last-child' : 'first-child'}`
            )
          }
        }

        currentRow.classList.remove('is--selected')
        otherRow?.classList.add('is--selected')
        otherRow?.scrollIntoView({ behavior: 'smooth', block: 'end' })
      }

      if (event.code === 'Enter') {
        if (!currentRow) {
          return
        }

        const tokenName: any = currentRow.querySelector('td.token__name')
        tokenName && tokenName.click()
      }
    }

    window.addEventListener('keydown', handleKeys)

    return () => {
      window.removeEventListener('keydown', handleKeys)
    }
  }, [])

  useEffect(() => {
    fetchTokens()
  }, [])

  useEffect(() => {
    const interval = setInterval(fetchTokens, 1800000)
    return () => clearInterval(interval)
  }, [filteredTokens])

  useEffect(() => {
    if (filter === 'favorite') {
      setFilteredTokens(favorites || [])
    }
  }, [favorites.length])

  useEffect(() => {
    if (props.debouncedText.length > 0) {
      setShownTokens(props.debouncedText)
      setFilterTop()
    } else {
      if (filter === 'up') {
        setFilteredTokens(tokens.slice(0, 20))
      }
    }
  }, [props.debouncedText])

  useEffect(() => {
    const updated = async () => {
      if (filter === 'wallet-tab' && !account) {
        return props.openProviderMenu()
      }
      if (filter === 'favorite' || filter === 'wallet-tab') {
        props.setSearchSymbol('')
      }
      let filterTokens: Token[] = []

      if (filter === 'up' && props.debouncedText.length <= 0) filterTokens = tokens.slice(0, 20)

      if (filter === 'favorite') {
        filterTokens = favorites || []
      }

      setFilteredTokens(filterTokens)
    }
    updated()
  }, [filter])

  const setShownTokens = async (symbol: string) => {
    setIsLoading(true)
    const tokens = await searchTokensBySymbol(symbol)
    const arrayOfTokens = checkTokensDataIsArray(tokens)
    setIsLoading(false)
    return setFilteredTokens(arrayOfTokens)
  }

  const fetchTokens = async () => {
    getSortedTokens().then((data: Token[]) => {
      setTokens(data)
      if (filter === 'up') {
        setFilteredTokens(data.slice(0, 20))
      }
    })
  }

  const loadFavorites = async (): Promise<void> => {
    setIsLoading(true)
    const loadedFavorites = await fetchFavorites()
    reduxDispatch(setFavorites(loadedFavorites))
    setIsLoading(false)
  }

  const changeFilterSearch = async (event: any) => {
    const parent = event.target.closest('.group-button-purple')
    const buttons = parent.querySelectorAll('.button')
    const gridButtonItems = [].slice.call(buttons)

    gridButtonItems.forEach((item: any) => {
      if (item.classList.contains('active')) item.classList.remove('active')
    })
    event.target.classList.add('active')
    const value = event.target.dataset.filter

    setFilter(value)

    if (value === 'favorite' && !favorites.length) {
      await loadFavorites()
    }
  }

  const setFilterTop = () => {
    const search = document.querySelector('.omnibox-search')
    const buttons = search?.querySelectorAll('.button')
    const gridButtonItems = [].slice.call(buttons)
    gridButtonItems.forEach((item: any) => {
      item.classList.remove('active')
      if (item.dataset.filter === 'up') {
        item.classList.add('active')
      }
    })
    setFilter('up')
  }

  const checkTokensDataIsArray = (data: any) => {
    if (!data) return []
    if (data && !Array.isArray(data.data)) {
      const array = []
      array.push(data)
      return array
    }
    return data.data
  }

  const verifiedTokens = filteredTokens.filter((item) => {
    return item.verified
  })
  const unverifiedTokens = filteredTokens.filter((item) => {
    return !item.verified
  })

  return (
    <div
      className={classNames(
        'dropdown-search',
        { 'dropdown-search--active': props.isActiveSearch },
        `${filter}`
      )}>
      <div className="dropdown-search__filter">
        <div className="group-button-purple">
          <button
            className={`button purple active`}
            data-filter={'up'}
            onClick={changeFilterSearch}>
            Top Volume
          </button>
          <button className="button purple" data-filter="favorite" onClick={changeFilterSearch}>
            Favorites
          </button>
          <button
            className={`button purple`}
            data-filter={'wallet-tab'}
            onClick={changeFilterSearch}>
            Wallet
          </button>
        </div>
      </div>
      {filter === 'wallet-tab' && (
        <WalletTab searchHide={props.searchHide} setSearchSymbol={props.setSearchSymbol} />
      )}
      {(filter === 'up' || filter === 'favorite') && (
        <div className="dropdown-search__body">
          <div className="dropdown-search__wrapper">
            {isLoading ? (
              <div className="loader-place ">
                <Loader />
              </div>
            ) : (
              <React.Fragment>
                {verifiedTokens.length === 0 &&
                unverifiedTokens &&
                unverifiedTokens.length === 0 ? (
                  <div className="not-found">
                    It looks like there aren't many great matches for your search.
                    <br />
                    <br />
                    Try using smart contract address, or token ticker.
                  </div>
                ) : (
                  <React.Fragment>
                    {verifiedTokens.length > 0 && (
                      <table className="dropdown-search__table dropdown-search__table--verified">
                        <DropdownSearchHead
                          optionDropdown={optionDropdown}
                          setOptionDropdown={setOptionDropdown}
                        />
                        <TokenList
                          tokens={verifiedTokens}
                          searchHide={props.searchHide}
                          optionDropdown={optionDropdown}
                        />
                      </table>
                    )}
                    {unverifiedTokens && unverifiedTokens.length !== 0 && (
                      <React.Fragment>
                        {verifiedTokens.length !== 0 && <hr className="divider" />}
                        <div className="dropdown-search__unverified">
                          <div className="icon">
                            <Hmm />
                          </div>
                          <div className="phrase">
                            You are going into a full degen mode. We could not confirm authenticity
                            of tokens below
                          </div>
                        </div>
                        <table className="dropdown-search__table dropdown-search__table--unverified">
                          {verifiedTokens.length === 0 && (
                            <DropdownSearchHead
                              optionDropdown={optionDropdown}
                              setOptionDropdown={setOptionDropdown}
                            />
                          )}
                          <TokenList
                            tokens={unverifiedTokens}
                            searchHide={props.searchHide}
                            optionDropdown={optionDropdown}
                          />
                        </table>
                      </React.Fragment>
                    )}
                  </React.Fragment>
                )}
              </React.Fragment>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
