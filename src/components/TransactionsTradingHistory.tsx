import React, { useEffect, useRef, useState } from 'react'

import { connect, useSelector } from 'react-redux'
import { DEFAULT_TRANSACTIONS_TRADING_HISTORY, dexGuruAPIUrl } from '../config/settings'
import { usePrevious } from '../hooks'
import { setCurrentTradingHistoryFull, setPreviousTradingHistoryFull } from '../actions'
import { getHeightElement, getTokenAddressFromId } from '../utils'
import Pagination from './Pagination'
import Filter from '../images/icons/filter.svg'
import Close from '../images/icons/close.svg'
import TransactionsHistoryRow from './TransactionsHistoryRow'
import SideFilter from './SideFilter'
import ReactTooltip from 'react-tooltip'
import classNames from 'classnames'
import { getFilteredData } from '../helpers/filterHelper'
import { State } from '../reducers'
import { FilterOptions, Trade } from '../index'
import { apiFetch } from '../dexguruFetch'

interface TransactionsTradingHistoryProps {
  setCurrentTradingHistoryFull: (history: Trade[]) => void
  setPreviousTradingHistoryFull: (history: Trade[]) => void
  changeLoadingSidebarFull: (side: boolean) => void
}

function TransactionsTradingHistory(props: TransactionsTradingHistoryProps) {
  const [tradingHistoryData, setTradingHistoryData] = useState<Trade[]>([])
  const [filteredHistoryData, setFilteredTradingHistoryData] = useState([])
  const [countNewRow, setCountNewRow] = useState(-1)
  const [numberPagination, setNumberPagination] = useState(1)
  const [filteredQuantityGrids, setFilteredQuantityGrids] = useState(10)
  const [quantityRows, setQuantityRows] = useState(10)
  const [quantityGrids, setQuantityGrids] = useState(1)
  const [isOpenFilter, setIsOpenFilter] = useState(false)
  const [optionFilter, setOptionFilter] = useState<FilterOptions>({
    amm: '',
    date: { checked: false },
    dex: 'all',
    tradeSize: { checked: false, sign: 'less', value: '' },
    soldToken: { checked: false, sign: 'less', value: '', symbol: '' },
    boughtToken: { checked: false, sign: 'less', value: '', symbol: '' },
    walletAddress: { checked: false, value: '' },
    walletCategoryValue: { checked: false, value: [] },
  })
  const selectedCurrency = useSelector((state: State) => state.currency)
  const currentToken = useSelector((state: State) => state.currentToken)
  const previousTradingHistory = useSelector((state: State) => state.previousTradingHistoryFull)
  const currentTradingHistory = useSelector((state: State) => state.currentTradingHistoryFull)
  const previousTradingHistoryState: Trade[] | undefined = usePrevious(tradingHistoryData)
  const previousCountNewRow = usePrevious(countNewRow)
  const previousCurrentTokenID = usePrevious(currentToken.id)

  const sidebarTradingVolume = useRef(null)
  const tradingVolumeRef = useRef(null)

  useEffect(() => {
    if (tradingVolumeRef.current) {
      const quantityTransactionsRows = getQuantityRows()
      setQuantityRows(quantityTransactionsRows)
    }
  }, [tradingVolumeRef.current])

  useEffect(() => {
    if (!currentToken.id) return
    getTradingHistoryData(DEFAULT_TRANSACTIONS_TRADING_HISTORY, numberPagination, false).then(
      ReactTooltip.rebuild
    )
  }, [])

  useEffect(() => {
    if (!currentToken.id) return

    if (previousCurrentTokenID !== currentToken.id && quantityRows && tradingVolumeRef.current) {
      getTradingHistoryData(DEFAULT_TRANSACTIONS_TRADING_HISTORY, numberPagination, false).then(
        ReactTooltip.rebuild
      )
    }
  }, [currentToken.id, quantityRows])

  useEffect(() => {
    getCountNewRows()
  }, [currentTradingHistory])

  useEffect(() => {
    const count = quantityRows * quantityGrids
    if (numberPagination !== 1 && numberPagination === quantityGrids) {
      getTradingHistoryData(count, numberPagination + 1, true)
    }
    ReactTooltip.rebuild()
  }, [numberPagination])

  useEffect(() => {
    if (tradingHistoryData.length !== 0) {
      const currentTokenId = getTokenAddressFromId(currentToken).toLowerCase()
      const filteredTradingHistory = getFilteredData(
        tradingHistoryData,
        optionFilter,
        false,
        currentTokenId
      )
      setFilteredTradingHistoryData(filteredTradingHistory)
    }
  }, [optionFilter])

  useEffect(() => {
    const quantityGrids =
      Math.ceil(filteredHistoryData.length / quantityRows) !== 0
        ? Math.ceil(filteredHistoryData.length / quantityRows)
        : 1
    setFilteredQuantityGrids(quantityGrids)
  }, [filteredHistoryData])

  const getQuantityRows = () => {
    const tradingVolumeRow = document.querySelector('.transaction-trow')

    const tradingVolumeHeight = getHeightElement(tradingVolumeRef.current)
    const tradingVolumeRowHeight = getHeightElement(tradingVolumeRow)
    return Math.floor(tradingVolumeHeight / tradingVolumeRowHeight)
  }

  const getTradingHistoryData = async (count: number, page: number, isConcat: boolean) => {
    let previousTradingHistoryData = isConcat ? tradingHistoryData : []
    let currentTradingHistoryData: Trade[] = []
    const response = await apiFetch(
      `${dexGuruAPIUrl}/tokens/${currentToken.id}/swaps?from_num=${page}&size=${count}&network=bsc`
    )
    if (response.data.length > 0) {
      currentTradingHistoryData = previousTradingHistoryData.concat(response.data)
    }

    const quantityGrids = Math.floor(currentTradingHistoryData.length / quantityRows)
    setQuantityGrids(quantityGrids)
    setFilteredQuantityGrids(quantityGrids)
    setTradingHistoryData(currentTradingHistoryData)
    const currentTokenId = getTokenAddressFromId(currentToken).toLowerCase()
    const filteredTradingHistory = getFilteredData(
      currentTradingHistoryData,
      optionFilter,
      false,
      currentTokenId
    )
    setFilteredTradingHistoryData(filteredTradingHistory)
    props.setCurrentTradingHistoryFull(currentTradingHistoryData)
    previousTradingHistoryState && props.setPreviousTradingHistoryFull(previousTradingHistoryState)
    props.changeLoadingSidebarFull(false)
    return currentTradingHistoryData
  }

  const getCountNewRows = () => {
    if (previousTradingHistory && currentTradingHistory) {
      let index = previousCountNewRow || -1
      const firstTimestampPrevious = Object(previousTradingHistory[0]).timestamp
      currentTradingHistory.forEach((currentItem: Trade, i: number) => {
        if (firstTimestampPrevious < Object(currentItem).timestamp) index = i
      })
      setCountNewRow(index)
    }
  }

  const toggleFilter = () => {
    setIsOpenFilter(!isOpenFilter)
  }

  const setOptionFilterProps = (options: FilterOptions) => {
    setOptionFilter(options)
    setNumberPagination(1)
  }

  if (tradingHistoryData.length === 0) return null

  const assetItems = filteredHistoryData.map((e: Trade, i: number) => (
    <TransactionsHistoryRow
      setCountNewRow={setCountNewRow}
      countNewRow={countNewRow}
      isAnimated={
        previousTradingHistoryState &&
        previousTradingHistoryState[i] &&
        e.id !== previousTradingHistoryState[i].id
      }
      classAnimated={countNewRow !== -1 && countNewRow >= i ? 'fade-enter-done' : ''}
      key={`${e.id}-${i}`}
      {...e}
    />
  ))

  const shownAssetItems = assetItems.slice(
    (numberPagination - 1) * quantityRows,
    (numberPagination - 1) * quantityRows + quantityRows
  )

  return (
    <div className="sidebar-full-content transactions" ref={sidebarTradingVolume}>
      {isOpenFilter && (
        <React.Fragment>
          <div className="side-filter-blur" />
          <SideFilter
            closeFilter={toggleFilter}
            setOptionFilterProps={setOptionFilterProps}
            optionFilter={optionFilter}
            isPoolActivity={false}
          />
        </React.Fragment>
      )}
      <div className="transactions-header">
        <div className="transactions-header-wrapper">
          <div className="transactions-header-title">Transactions</div>
          <button
            className={classNames('button  button--sm button--inline button--filter', {
              'button--action': isOpenFilter,
            })}
            onClick={toggleFilter}>
            <i className="icon">
              <Filter />
            </i>
            <span className="caption">Filter</span>
            {isOpenFilter && (
              <i className="icon">
                <Close />
              </i>
            )}
          </button>
        </div>
        <div className="transactions-thead">
          <div className="dex">Dex</div>
          <div className="delta" />
          <div className="trade">
            Trade size,&nbsp;{selectedCurrency === 'USD' ? 'USD' : selectedCurrency}
          </div>
          <div className="sold">Sold token</div>
          <div className="bought">Bought token</div>
          <div className="account">Account</div>
          <div className="icon" />
          <div className="time">Time</div>
        </div>
      </div>
      <div className="transactions-content" ref={tradingVolumeRef}>
        <div className="transactions-table">
          <div className={classNames('transactions-tbody', { empty: assetItems.length === 0 })}>
            {assetItems.length === 0 ? (
              <p>It looks like there aren't many great matches for your search.</p>
            ) : (
              shownAssetItems
            )}
          </div>
        </div>
      </div>
      <div className="transactions-footer">
        {assetItems.length !== 0 && filteredQuantityGrids > 1 && (
          <Pagination
            numberPagination={numberPagination}
            setNumberPagination={setNumberPagination}
            filteredQuantityGrids={filteredQuantityGrids}
          />
        )}
      </div>
      <ReactTooltip
        id="sidebar-trader-tooltip"
        className="tooltip_sidebar"
        place="top"
        effect="solid"
        backgroundColor="#6d7986"
      />
    </div>
  )
}
const mapDispatchToprops = {
  setCurrentTradingHistoryFull,
  setPreviousTradingHistoryFull,
}

export default connect(null, mapDispatchToprops)(TransactionsTradingHistory)
