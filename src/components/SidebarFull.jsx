import React, { useEffect, useState, useRef } from 'react'

import TopPartFull from './TopPartFull'
import TransactionsPoolActivity from './TransactionsPoolActivity'
import TransactionsTradingHistory from './TransactionsTradingHistory'
import Close from '../images/icons/close.svg'
import Loader from './../components/Loader'

export default function SidebarFull(props) {
  const sidebarRef = useRef(null)
  const [isLoadingSidebarFull, setIsLoadingSidebarFull] = useState(true)

  const closeFullSidebar = () => {
    props.changeLoadingPoolActivity(true)
    props.changeLoadingTradingVolume(true)
    props.setOpenSidebar('auto')
  }

  const changeLoadingSidebarFull = (isLoading) => {
    setIsLoadingSidebarFull(isLoading)
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

  return (
    <div
      className={`full-side sidebar-wrapper ${props.isLeft ? 'left-sidebar ' : 'right-sidebar '}`}
      ref={sidebarRef}>
      {isLoadingSidebarFull && <Loader />}
      <button type="button" className="sidebar-open-button " onClick={() => closeFullSidebar()}>
        <div className="arrow-icon">
          <Close />
        </div>
      </button>
      <div className="sidebar">
        <div className="part">
          <div className="left-part-wrapper">
            <TopPartFull isLeft={props.isLeft} openSidebar={props.openSidebar} />
          </div>
        </div>
        <div className="part">
          {props.isLeft ? (
            <TransactionsPoolActivity changeLoadingSidebarFull={changeLoadingSidebarFull} />
          ) : (
            <TransactionsTradingHistory changeLoadingSidebarFull={changeLoadingSidebarFull} />
          )}
        </div>
      </div>
    </div>
  )
}
