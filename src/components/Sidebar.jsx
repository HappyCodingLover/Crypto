import React, { useEffect, useState } from 'react'

import TopPart from './TopPart.jsx'
import PoolActivity from './PoolActivity'
import TradingHistory from './TradingHistory'
import Arrow from '../images/icons/arrow.svg'
import OpenArrow from '../images/icons/open.svg'
import SidebarFull from './SidebarFull.jsx'

export default function Sidebar(props) {
  const [isOpen, setOpen] = useState(true)

  const openFullSidebar = () => {
    props.setOpenSidebar(props.isLeft ? 'left' : 'right')
  }

  const closeFullSidebar = () => {
    props.setOpenSidebar('auto')
  }

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.keyCode === 27) {
        closeFullSidebar()
      }
    }
    window.addEventListener('keydown', handleEsc)

    return () => {
      window.removeEventListener('keydown', handleEsc)
    }
  }, [])

  return (props.openSidebar === 'left' && props.isLeft) ||
    (props.openSidebar === 'right' && !props.isLeft) ? (
    <SidebarFull
      openSidebar={props.openSidebar}
      setOpenSidebar={props.setOpenSidebar}
      isLeft={props.isLeft}
      changeLoadingPoolActivity={props.changeLoadingPoolActivity}
      changeLoadingTradingVolume={props.changeLoadingTradingVolume}
    />
  ) : props.openSidebar === 'auto' || props.isMobile ? (
    <div
      className={`sidebar ${props.isLeft ? 'sidebar--left ' : 'sidebar--right '} ${
        isOpen ? 'open' : 'close'
      }`}>
      <div className="sidebar__wrapper">
        <div className="sidebar__header">
          <TopPart isLeft={props.isLeft} />
        </div>
        <div className="sidebar__body">
          {props.isLeft ? (
            <PoolActivity changeLoadingPoolActivity={props.changeLoadingPoolActivity} />
          ) : (
            <TradingHistory changeLoadingTradingVolume={props.changeLoadingTradingVolume} />
          )}
        </div>
      </div>
      <button
        type="button"
        className="sidebar__toggle sidebar__toggle--hide"
        onClick={() => setOpen(!isOpen)}>
        <div className="arrow-icon">
          <Arrow />
        </div>
      </button>
      {process.env.REACT_APP_V_1_1_ON === 'true' && (
        <button
          type="button"
          className="sidebar__toggle sidebar__toggle--open"
          onClick={() => openFullSidebar()}>
          <div className="arrow-icon">
            <OpenArrow />
          </div>
        </button>
      )}
    </div>
  ) : (
    <div></div>
  )
}
