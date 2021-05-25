import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import cn from 'classnames'
import MainPartDesktop from '../MainPart/MainPartDesktop'
import Sidebar from '../Sidebar.jsx'
import Loader from '../Loader'
import { setDataChart } from '../../actions'
import { HISTORY_DATA_REFRESH_INTERVAL } from '../../config/settings'
import { Token, TradeType } from '../..'
import { loadDataChart } from '../../services/chartService'

interface DashboardDesktopProps {
  setLoading: (value: boolean) => void
  openProviderMenu: () => void
  openVerify: (tokenFrom: Token, tokenTo: Token, tradeType: TradeType) => void
}

function DashboardDesktop({ openProviderMenu, openVerify, setLoading }: DashboardDesktopProps) {
  const reduxDispatch = useDispatch()
  const currentToken = useSelector((state: any) => state.currentToken)
  const selectedCurrency = useSelector((state: any) => state.currency)
  const [openSidebar, setOpenSidebar] = useState<'left' | 'right' | 'auto'>('auto')
  const [isLoadingPoolActivity, setIsLoadingPoolActivity] = useState(false)
  const [isLoadingTradingVolume, setIsLoadingTradingVolume] = useState(false)

  const changeLoadingPoolActivity = (value: boolean) => {
    setIsLoadingPoolActivity(value)
  }

  const changeLoadingTradingVolume = (value: boolean) => {
    setIsLoadingTradingVolume(value)
  }

  useEffect(() => {
    const timer = setInterval(
      async () => await loadDataChart(selectedCurrency, currentToken),
      HISTORY_DATA_REFRESH_INTERVAL
    )
    return () => clearInterval(timer)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (currentToken?.id && selectedCurrency) {
      const getData = async () => {
        const chartData = await loadDataChart(selectedCurrency, currentToken)

        if (chartData) {
          reduxDispatch(setDataChart(chartData))
        }
      }

      getData()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentToken?.id, selectedCurrency, currentToken])

  return (
    <div className="dashboard dashboard--desktop">

        <main className={cn('dashboard__main', { close: openSidebar !== 'auto' })}>
        <MainPartDesktop
          openProviderMenu={openProviderMenu}
          openVerify={openVerify}
          setLoading={setLoading}
          openSidebar={openSidebar}
        />
      </main>
      {/*<aside
        className={cn('dashboard__sidebar', 'dashboard__sidebar--right', {
          open: openSidebar === 'right',
          close: openSidebar === 'left',
        })}>
        <Sidebar
          isLeft={false}
          isMobile={false}
          openSidebar={openSidebar}
          setOpenSidebar={setOpenSidebar}
          changeLoadingTradingVolume={changeLoadingTradingVolume}
          changeLoadingPoolActivity={changeLoadingPoolActivity}
        />
      </aside>*/}
    </div>
  )
}

export default DashboardDesktop
