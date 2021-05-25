import React, { useEffect, useRef, useState } from 'react'
import { DEFAULT_TRANSACTIONS_POOL_ACTIVITY, dexGuruAPIUrl } from '../config/settings'
import TransactionsPoolRow from './TransactionsPoolRow'
import { connect, useSelector } from 'react-redux'
import { usePrevious } from '../hooks'
import { getHeightElement, getTokenAddressFromId } from '../utils'
import { CSSTransition, SwitchTransition } from 'react-transition-group'
import { setCurrentPoolActivityFull, setPreviousPoolActivityFull } from '../actions'
import ReactTooltip from 'react-tooltip'
import Pagination from './Pagination'
import SideFilter from './SideFilter'
import Filter from '../images/icons/filter.svg'
import Close from '../images/icons/close.svg'
import { getFilteredData } from '../helpers/filterHelper'
import classNames from 'classnames'
import { State } from '../reducers'
import { FilterOptions, PoolTrade } from '../index'
import { apiFetch } from '../dexguruFetch'

interface TransactionsPoolActivityProps {
  setCurrentPoolActivityFull: (activity: PoolTrade[]) => void
  setPreviousPoolActivityFull: (activity: PoolTrade[]) => void
  changeLoadingSidebarFull: (loading: boolean) => void
}
function TransactionsPoolActivity(props: TransactionsPoolActivityProps) {
  const [option, setOption] = useState('all')
  const [poolActivityData, setPoolActivityData] = useState<PoolTrade[]>([])
  const [filteredPoolActivityData, setFilteredPoolActivityData] = useState([])
  const [animate, setAnimate] = React.useState(true)
  const [countNewRowActivity, setCountNewRowActivity] = useState(-1)
  const [columnRow, setColumnRow] = useState(0)
  const [numberPagination, setNumberPagination] = useState(1)
  const [filteredQuantityGrids, setFilteredQuantityGrids] = useState(10)
  const [quantityRows, setQuantityRows] = useState(10)
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
  const [quantityGrids, setQuantityGrids] = useState({ all: 1, add: 1, remove: 1 })
  const selectedCurrency = useSelector((state: State) => state.currency)
  const currentToken = useSelector((state: State) => state.currentToken)

  const previousPoolActivity = useSelector((state: State) => state.previousPoolActivityFull)
  const currentPoolActivity = useSelector((state: State) => state.currentPoolActivityFull)

  const previousPoolActivityState = usePrevious(poolActivityData)
  const previousCountNewRowActivity = usePrevious(countNewRowActivity)
  const previousColumn = usePrevious(columnRow)

  const previousCurrentTokenID = usePrevious(currentToken.id)

  const poolActivityRef = useRef(null)

  const getPoolActivity = async (count: number, page: number, isConcat: boolean) => {
    let previousPoolActivityData = isConcat ? poolActivityData : []
    let currentPoolActivityData = []
    const mintsAPI = `${dexGuruAPIUrl}/tokens/${currentToken.id}/mints?from_num=${page}&size=${count}`
    const burnsAPI = `${dexGuruAPIUrl}/tokens/${currentToken.id}/burns?from_num=${page}&size=${count}`

    const responseMints = await apiFetch(mintsAPI)
    if (!responseMints) {
      return
    }

    const mintsArray = responseMints.data.map((current: PoolTrade) => {
      let item = Object.assign({}, current)
      item.add = true
      return item
    })

    const responseBurns = await apiFetch(burnsAPI)

    if (!responseBurns) {
      return
    }

    const burnsArray = responseBurns.data.map((current: PoolTrade) => {
      let item = Object.assign({}, current)
      item.add = false
      return item
    })

    const currentPoolActivity = mintsArray
      .concat(burnsArray)
      .sort((a: PoolTrade, b: PoolTrade) => (a.timestamp > b.timestamp ? -1 : 1))

    currentPoolActivityData = previousPoolActivityData.concat(currentPoolActivity)

    const quantityGrids = Math.floor(currentPoolActivityData.length / quantityRows)
    const quantityAddGrids = Math.floor(mintsArray.length / quantityRows)
    const quantityRemoveGrids = Math.floor(burnsArray.length / quantityRows)
    setQuantityGrids({
      all: quantityGrids,
      add: quantityAddGrids,
      remove: quantityRemoveGrids,
    })

    setPoolActivityData(currentPoolActivityData)
    const currentTokenId = getTokenAddressFromId(currentToken).toLowerCase()
    const filteredPoolActivity = getFilteredData(
      currentPoolActivityData,
      optionFilter,
      true,
      currentTokenId
    )
    setFilteredPoolActivityData(filteredPoolActivity)
    props.setCurrentPoolActivityFull(currentPoolActivityData)
    previousPoolActivityState && props.setPreviousPoolActivityFull(previousPoolActivityState)
    props.changeLoadingSidebarFull(false)
    return currentPoolActivityData
  }

  useEffect(() => {
    if (poolActivityRef.current) {
      const quantityTransactionsRows = getQuantityRows()
      setQuantityRows(quantityTransactionsRows)
      const mintsArray = poolActivityData.filter((item) => item.add)
      const burnsArray = poolActivityData.filter((item) => !item.add)
      const quantityGrids = Math.floor(poolActivityData.length / quantityTransactionsRows)
      const quantityAddGrids = Math.floor(mintsArray.length / quantityTransactionsRows)
      const quantityRemoveGrids = Math.floor(burnsArray.length / quantityTransactionsRows)
      setQuantityGrids({ all: quantityGrids, add: quantityAddGrids, remove: quantityRemoveGrids })
      setFilteredQuantityGrids(quantityGrids)
    }
  }, [poolActivityRef.current])

  useEffect(() => {
    if (!currentToken.id) return
    getPoolActivity(DEFAULT_TRANSACTIONS_POOL_ACTIVITY, numberPagination, false).then(
      ReactTooltip.rebuild
    )
  }, [])

  useEffect(() => {
    if (!currentToken.id) return
    if (previousCurrentTokenID !== currentToken.id && quantityRows && poolActivityRef.current) {
      getPoolActivity(DEFAULT_TRANSACTIONS_POOL_ACTIVITY, numberPagination, false).then(
        ReactTooltip.rebuild
      )
    }
  }, [currentToken.id, quantityRows])

  useEffect(() => {
    getCountNewRowsActivity()
  }, [currentPoolActivity])

  useEffect(() => {
    const count = quantityRows * quantityGrids.all
    if (
      numberPagination !== 1 &&
      (numberPagination === quantityGrids.add || numberPagination === quantityGrids.remove)
    ) {
      getPoolActivity(count, numberPagination + 1, true)
    }
    ReactTooltip.rebuild()
  }, [numberPagination])

  const getQuantityRows = () => {
    const tradingVolumeRow = document.querySelector('.transaction-trow')

    const tradingVolumeHeight = getHeightElement(poolActivityRef.current)
    const tradingVolumeRowHeight = getHeightElement(tradingVolumeRow)
    return Math.floor(tradingVolumeHeight / tradingVolumeRowHeight)
  }

  useEffect(() => {
    if (poolActivityData.length !== 0) {
      const currentTokenId = getTokenAddressFromId(currentToken).toLowerCase()
      const filteredPoolActivity = getFilteredData(
        poolActivityData,
        optionFilter,
        true,
        currentTokenId
      )
      setFilteredPoolActivityData(filteredPoolActivity)
    }
  }, [optionFilter])

  useEffect(() => {
    const quantityGrids =
      Math.ceil(filteredPoolActivityData.length / quantityRows) !== 0
        ? Math.ceil(filteredPoolActivityData.length / quantityRows)
        : 1
    setFilteredQuantityGrids(quantityGrids)
  }, [filteredPoolActivityData])

  const selectSetting = (event: any) => {
    const parent = event.target.closest('.group-button-purple')
    const buttons = parent.querySelectorAll('.button')
    const gridButtonItems = [].slice.call(buttons)
    gridButtonItems.forEach((item: HTMLElement) => {
      if (item.classList.contains('active')) {
        item.classList.remove('active')
      }
    })
    event.target.classList.add('active')
    setOption(event.target.dataset.option)
    setColumnRow(event.target.dataset.column)
    if (option !== event.target.dataset.option) setAnimate(!animate)
  }

  const getCountNewRowsActivity = () => {
    if (previousPoolActivity && currentPoolActivity) {
      let index = previousCountNewRowActivity || -1
      const firstTimestampPrevious = Object(previousPoolActivity[0]).timestamp
      currentPoolActivity.forEach((currentItem, i) => {
        if (firstTimestampPrevious < Object(currentItem).timestamp) index = i
      })
      setCountNewRowActivity(index)
    }
  }

  const toggleFilter = () => {
    setIsOpenFilter(!isOpenFilter)
  }

  const setOptionFilterProps = (options: FilterOptions) => {
    setOptionFilter(options)
    setNumberPagination(1)
  }

  if (poolActivityData.length === 0) return null

  const allPoolRows = filteredPoolActivityData.map((e: PoolTrade, i: number) => (
    <TransactionsPoolRow
      setСountNewRowActivity={setCountNewRowActivity}
      countNewRowActivity={countNewRowActivity}
      index={i}
      key={e.id}
      {...e}
    />
  ))

  const filteredPoolRows =
    option === 'add'
      ? allPoolRows.filter((item) => item.props.add === true)
      : allPoolRows.filter((item) => item.props.add === false)

  return (
    <React.Fragment>
      <div
        className={`sidebar-full-content transactions  ${
          columnRow > (previousColumn || 0) ? 'right' : 'left'
        }`}>
        {isOpenFilter && (
          <React.Fragment>
            <div className="side-filter-blur" />
            <SideFilter
              closeFilter={toggleFilter}
              setOptionFilterProps={setOptionFilterProps}
              optionFilter={optionFilter}
              isPoolActivity={true}
            />
          </React.Fragment>
        )}
        <div className="transactions-header">
          <div className="transactions-header-wrapper">
            <div className="transactions-header-title">Liquidity Pools Activity</div>
            <div className="transactions-header-buttons">
              <div className="group-button-purple">
                <button
                  data-option="all"
                  data-column={0}
                  className="button purple active"
                  onClick={selectSetting}>
                  All
                </button>
                <button
                  data-option="add"
                  data-column={1}
                  className="button purple"
                  onClick={selectSetting}>
                  Adds
                </button>
                <button
                  data-option="remove"
                  data-column={2}
                  className="button purple"
                  onClick={selectSetting}>
                  Removes
                </button>
              </div>
              <button
                className={`button  button--sm button--inline button--filter ${
                  isOpenFilter ? 'button--action' : ''
                }`}
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
          </div>
          <div className="transactions-thead">
            <div className="dex">Dex</div>
            <div className="delta" />
            <div className="trade">
              Total Value,&nbsp;{selectedCurrency === 'USD' ? '$' : selectedCurrency}
            </div>
            <div className="sold">Token, A</div>
            <div className="bought">Token, B</div>
            <div className="account">Account</div>
            <div className="icon" />
            <div className="time">Time</div>
          </div>
        </div>
        <div className="transactions-content" ref={poolActivityRef}>
          <div className="transactions-table">
            <SwitchTransition mode={'out-in'}>
              <CSSTransition
                key={String(animate)}
                addEndListener={(node, done) => {
                  node.addEventListener('transitionend', done, false)
                }}
                classNames="fade">
                <div
                  className={classNames('transactions-tbody', { empty: allPoolRows.length === 0 })}>
                  {allPoolRows.length === 0 ? (
                    <p>It looks like there aren't many great matches for your search.</p>
                  ) : option === 'all' ? (
                    allPoolRows.slice(
                      (numberPagination - 1) * quantityRows,
                      (numberPagination - 1) * quantityRows + quantityRows
                    )
                  ) : (
                    filteredPoolRows.slice(
                      (numberPagination - 1) * quantityRows,
                      (numberPagination - 1) * quantityRows + quantityRows
                    )
                  )}
                </div>
              </CSSTransition>
            </SwitchTransition>
          </div>
        </div>
        <div className="transactions-footer">
          {allPoolRows.length !== 0 && filteredQuantityGrids > 1 && (
            <Pagination
              numberPagination={numberPagination}
              setNumberPagination={setNumberPagination}
              filteredQuantityGrids={filteredQuantityGrids}
            />
          )}
        </div>
        <ReactTooltip
          id="sidebar-liquidity-tooltip"
          className="tooltip_sidebar"
          place="top"
          effect="solid"
          backgroundColor="#6d7986"
        />
      </div>
    </React.Fragment>
  )
}

const mapDispatchToprops = {
  setCurrentPoolActivityFull,
  setPreviousPoolActivityFull,
}

export default connect(null, mapDispatchToprops)(TransactionsPoolActivity)
