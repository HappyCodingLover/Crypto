import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs'
import MainPartMobile from '../MainPart/MainPartMobile'
import Sidebar from '../Sidebar.jsx'
import { setDataChart } from '../../actions'
import Overview from '../Overview'
import { InnerTabMobile } from './InnerTabMobile'
import Loader from './../Loader'
import LiquidityActive from '../../images/icons/mobile-liquidity-active.svg'
import LiquidityNotActive from '../../images/icons/mobile-liquidity-not-active.svg'
import MarketActive from '../../images/icons/mobile-market-active.svg'
import MarketNotActive from '../../images/icons/mobile-market-not-active.svg'
import VolumeActive from '../../images/icons/mobile-activity-active.svg'
import VolumeNotActive from '../../images/icons/mobile-activity-not-active.svg'
import DyorActive from '../../images/icons/emoji/mushroom.svg'
import DyorNotActive from '../../images/icons/mobile-dyor-not-active.svg'
import 'react-tabs/style/react-tabs.css'
import { loadDataChart } from '../../services/chartService'

interface DashboardMobileProps {
  setLoading: (value: boolean) => void
  openProviderMenu: () => void
}

function DashboardMobile({ openProviderMenu, setLoading }: DashboardMobileProps) {
  const reduxDispatch = useDispatch()

  const currentToken = useSelector((state: any) => state.currentToken)
  const selectedCurrency = useSelector((state: any) => state.currency)
  const [isLoadingPoolActivity, setIsLoadingPoolActivity] = useState(true)
  const [isLoadingTradingVolume, setIsLoadingTradingVolume] = useState(true)
  const [tabIndex, setTabIndex] = useState(0)

  const changeLoadingPoolActivity = (value: boolean) => {
    setIsLoadingPoolActivity(value)
  }
  const changeLoadingTradingVolume = (value: boolean) => {
    setIsLoadingTradingVolume(value)
  }

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
    <Tabs
      selectedIndex={tabIndex}
      onSelect={(index: number) => setTabIndex(index)}
      className="dashboard dashboard--mobile">
      <div className="dashboard__body">
        <TabPanel className="dashboard__panel dashboard__panel--main">
          <MainPartMobile openProviderMenu={openProviderMenu} setLoading={setLoading} />
        </TabPanel>

        <TabPanel className="dashboard__panel dashboard__panel--sidebar mobile-sidebar-left">
          {isLoadingPoolActivity && <Loader />}
          <Sidebar
            isLeft={true}
            isMobile={true}
            changeLoadingPoolActivity={changeLoadingPoolActivity}
          />
        </TabPanel>

        <TabPanel className="dashboard__panel dashboard__panel--sidebar mobile-sidebar-right">
          {isLoadingTradingVolume && <Loader />}
          <Sidebar
            isLeft={false}
            isMobile={true}
            changeLoadingTradingVolume={changeLoadingTradingVolume}
          />
        </TabPanel>

        <TabPanel className="dashboard__panel dashboard__panel--sidebar mobile-dyor">
          <Overview isOpenOverview={true} />
        </TabPanel>
      </div>
      <div className="dashboard__footer">
        <TabList>
          <Tab className="option">
            <InnerTabMobile title="Market">
              {tabIndex === 0 ? <MarketActive /> : <MarketNotActive />}
            </InnerTabMobile>
          </Tab>
          <Tab className="option" onClick={() => changeLoadingPoolActivity(true)}>
            <InnerTabMobile title="Liquidity">
              {tabIndex === 1 ? <LiquidityActive /> : <LiquidityNotActive />}
            </InnerTabMobile>
          </Tab>
          <Tab className="option" onClick={() => changeLoadingTradingVolume(true)}>
            <InnerTabMobile title="Activity">
              {tabIndex === 2 ? <VolumeActive /> : <VolumeNotActive />}
            </InnerTabMobile>
          </Tab>
          <Tab className="option">
            <InnerTabMobile title="DYOR">
              {tabIndex === 3 ? <DyorActive /> : <DyorNotActive />}
            </InnerTabMobile>
          </Tab>
        </TabList>
      </div>
    </Tabs>
  )
}

export default DashboardMobile
