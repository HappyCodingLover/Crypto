import React, { useEffect, useState, useRef } from 'react'
import { useSelector, connect } from 'react-redux'
import TradingHistoryRow from './TradingHistoryRow'
import { dexGuruAPIUrl } from '../config/settings'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { calculateMobile } from '../utils'
import { usePrevious } from '../hooks'
import { setCurrentTradingHistory, setPreviousTradingHistory } from '../actions'
import ReactTooltip from 'react-tooltip'
import { TXN_DATA_REFRESH_INTERVAL } from '../config/settings'
import { State } from '../reducers'
import { Trade } from '../index'
import { apiFetch } from '../dexguruFetch'

let interval: any | undefined = undefined

interface TradingHistoryProps {
  changeLoadingTradingVolume: (loading: boolean) => void
  setCurrentTradingHistory: (currentTradingHistory: Trade[]) => void
  setPreviousTradingHistory: (previousTradingHistory: Trade[]) => void
}

function TradingHistory(props: TradingHistoryProps) {
  const [tradingHistoryData, setTradingHistoryData] = useState([])
  const [countNewRow, setCountNewRow] = useState<number>(-1)

  const selectedCurrency = useSelector((state: State) => state.currency)
  const currentToken = useSelector((state: State) => state.currentToken)
  const isMobile = useSelector((state: State) => state.isMobile)
  const previousTradingHistory = useSelector((state: State) => state.previousTradingHistory)
  const currentTradingHistory = useSelector((state: State) => state.currentTradingHistory)

  const previousTradingHistoryState = usePrevious(tradingHistoryData)
  const previousCountNewRow = usePrevious(countNewRow)
  const sidebarRef = useRef(null)

  useEffect(() => {
    if (!currentToken.id) return
    getTradingHistoryData()
    interval = setInterval(getTradingHistoryData, TXN_DATA_REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [currentToken.id])

  useEffect(() => {
    getCountNewRows()
  }, [currentTradingHistory])

  useEffect(() => {}, [sidebarRef.current])

  const getTradingHistoryData = async () => {
    let currentTradingHistoryData = []
    const response = await apiFetch(
      `${dexGuruAPIUrl}/tokens/${currentToken.id}/swaps?from_num=0&size=30&sort_by=timestamp&sort_by2=id&asc=false`
    )
    if (response) {
      currentTradingHistoryData = response.data
    }

    setTradingHistoryData(currentTradingHistoryData)
    props.setCurrentTradingHistory(currentTradingHistoryData)
    previousTradingHistoryState && props.setPreviousTradingHistory(previousTradingHistoryState)
    props.changeLoadingTradingVolume && props.changeLoadingTradingVolume(false)
    ReactTooltip.rebuild()
  }

  const getCountNewRows = () => {
    if (previousTradingHistory && currentTradingHistory) {
      let index = previousCountNewRow || -1
      const firstTimestampPrevious = Object(previousTradingHistory[0]).timestamp
      currentTradingHistory.forEach((currentItem: Trade, i: number) => {
        if (firstTimestampPrevious < Object(currentItem).timestamp) {
          index = i
        }
      })
      setCountNewRow(index)
    }
  }

  if (tradingHistoryData.length === 0) return null
  const tradingHistoryRows = tradingHistoryData.map((e, i) => (
    <TradingHistoryRow
      setCountNewRow={setCountNewRow}
      countNewRow={countNewRow}
      classAnimated={countNewRow !== -1 && countNewRow >= i ? 'fade-enter-done' : ''}
      key={i}
      {...e}
    />
  ))
  return (
    <div className="trading-history" ref={sidebarRef}>
      <div className="title-table-sidebar">
        <h3>Trading History</h3>
      </div>
      <div className="trading-table">
        <div className="trading-table-thead thead-table-sidebar">
          <div className="title amount-value">
            <div>Token Amount</div>
          </div>
          <div className="title amount-symbol" />
          <div className="title value">
            <div>Token Value,&nbsp;{selectedCurrency === 'USD' ? '$' : selectedCurrency}</div>
          </div>
          <div className="title emoji" />
          <div className="title time">
            <div>Time</div>
          </div>
        </div>
        <div className="trading-table-body">
          <SimpleBar
            style={{
              maxHeight: isMobile ? calculateMobile(1) : 0,
            }}
            forceVisible="y">
            {tradingHistoryRows}
          </SimpleBar>
          <ReactTooltip
            id="sidebar-trader-tooltip"
            className="tooltip_sidebar"
            place="top"
            effect="solid"
            backgroundColor="#6d7986"
          />
        </div>
      </div>
    </div>
  )
}

const mapDispatchToprops = {
  setCurrentTradingHistory,
  setPreviousTradingHistory,
}

export default connect(null, mapDispatchToprops)(TradingHistory)
