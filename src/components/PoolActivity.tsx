import React, { useState, useEffect, useRef } from 'react'
import { calculateMobile, getHeightTableSidebar } from '../utils'
import { dexGuruAPIUrl } from '../config/settings'
import PoolActivityRow from './PoolActivityRow'
import SimpleBar from 'simplebar-react'
import 'simplebar/dist/simplebar.min.css'
import { useSelector, connect } from 'react-redux'
import { usePrevious } from '../hooks'
import { SwitchTransition, CSSTransition } from 'react-transition-group'
import { setCurrentPoolActivity, setPreviousPoolActivity } from '../actions'
import ReactTooltip from 'react-tooltip'
import { TXN_DATA_REFRESH_INTERVAL } from '../config/settings'
import { State } from '../reducers'
import { PoolTrade } from '../index'
import { apiFetch } from '../dexguruFetch'

let interval: any | undefined = undefined

interface PoolActivityProps {
  setCurrentPoolActivity: (poolActivity: PoolTrade[]) => void
  setPreviousPoolActivity: (poolActivity: PoolTrade[]) => void
  changeLoadingPoolActivity: (value: boolean) => void
}

function PoolActivity(props: PoolActivityProps) {
  const [option, setOption] = useState('all')
  const [poolActivityData, setPoolActivityData] = useState([])
  const [animate, setAnimate] = React.useState(true)
  const [countNewRowActivity, setCountNewRowActivity] = useState(-1)
  const [columnRow, setColumnRow] = useState(0)

  const selectedCurrency = useSelector((state: State) => state.currency)
  const currentToken = useSelector((state: State) => state.currentToken)

  const previousPoolActivity = useSelector((state: State) => state.previousPoolActivity)
  const currentPoolActivity = useSelector((state: State) => state.currentPoolActivity)
  const isMobile = useSelector((state: State) => state.isMobile)
  const previousPoolActivityState = usePrevious(poolActivityData)
  const previousCountNewRowActivity = usePrevious(countNewRowActivity)
  const previousColumn: number | undefined = usePrevious(columnRow)
  const [heightTable, setHeightTable] = useState(0)
  const sidebarRef = useRef(null)

  const loadData = async () => {
    const mintsAPI = `${dexGuruAPIUrl}/tokens/${currentToken.id}/mints`
    const burnsAPI = `${dexGuruAPIUrl}/tokens/${currentToken.id}/burns`
    const responseMints = await apiFetch(mintsAPI)

    if (!responseMints) {
      return
    }

    const mintsArray = responseMints.data.map((current: any) => {
      let item = Object.assign({}, current)
      item.add = true
      return item
    })

    const responseBurns = await apiFetch(burnsAPI)

    if (!responseBurns) {
      return
    }

    const burnsArray = responseBurns.data.map((current: any) => {
      let item = Object.assign({}, current)
      item.add = false
      return item
    })
    const poolActivity = mintsArray
      .concat(burnsArray)
      .sort((a: PoolTrade, b: PoolTrade) => (a.timestamp > b.timestamp ? -1 : 1))
    setPoolActivityData(poolActivity)
    props.setCurrentPoolActivity(poolActivity)
    previousPoolActivityState && props.setPreviousPoolActivity(previousPoolActivityState)
    props.changeLoadingPoolActivity && props.changeLoadingPoolActivity(false)
    ReactTooltip.rebuild()
  }

  useEffect(() => {
    if (sidebarRef.current) {
      const height = getHeightTableSidebar(sidebarRef.current)
      setHeightTable(height)
    }
  }, [sidebarRef.current])

  useEffect(() => {
    getCountNewRowsActivity()
  }, [currentPoolActivity])

  useEffect(() => {
    if (!currentToken.id) {
      return
    }
    loadData()
    interval = setInterval(loadData, TXN_DATA_REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [currentToken.id])

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
      currentPoolActivity.forEach((currentItem: PoolTrade, i: number) => {
        if (firstTimestampPrevious < Object(currentItem).timestamp) index = i
      })
      setCountNewRowActivity(index)
    }
  }

  if (poolActivityData.length === 0) return null

  const allPoolRows = poolActivityData.map((e: PoolTrade, i: number) => (
    <PoolActivityRow
      setСountNewRowActivity={setCountNewRowActivity}
      countNewRowActivity={countNewRowActivity}
      index={i}
      key={`${e.id}-${i}`}
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
        className={`sidebar-content  ${columnRow > (previousColumn || 0) ? 'right' : 'left'}`}
        ref={sidebarRef}>
        <div className="liquidity-header title-table-sidebar">
          <h3 className="liquidity-title">Pool Activity</h3>
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
        </div>
        <div className="liquidity-table">
          <div className="liquidity-thead thead-table-sidebar">
            <div className="sign-math" />
            <div className="title amount-value">
              <div>Token Amount</div>
            </div>
            <div className="title amount-symbol" />
            <div className="title total">
              <div>Token Value,&nbsp;{selectedCurrency === 'USD' ? '$' : selectedCurrency}</div>
            </div>
            <div className="emoji" />
            <div className="title time">
              <div>Time</div>
            </div>
          </div>
          <SimpleBar
            style={{
              maxHeight: isMobile ? calculateMobile(0) : heightTable,
            }}
            forceVisible="y">
            <SwitchTransition mode={'out-in'}>
              <CSSTransition
                key={String(animate)}
                addEndListener={(node, done) => {
                  node.addEventListener('transitionend', done, false)
                }}
                classNames="fade">
                <div className={`liquidity-tbody`}>
                  {option === 'all' ? allPoolRows : filteredPoolRows}
                </div>
              </CSSTransition>
            </SwitchTransition>
          </SimpleBar>
          <ReactTooltip
            id="sidebar-liquidity-tooltip"
            className="tooltip_sidebar"
            place="top"
            effect="solid"
            backgroundColor="#6d7986"
          />
        </div>
      </div>
    </React.Fragment>
  )
}

const mapDispatchToprops = {
  setCurrentPoolActivity,
  setPreviousPoolActivity,
}

export default connect(null, mapDispatchToprops)(PoolActivity)
