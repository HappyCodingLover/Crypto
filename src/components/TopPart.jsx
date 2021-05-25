import React, { useState, useEffect } from 'react'

import Chart from '../components/Chart'
import AnimatedNumber from './AnimatedNumber'
import { financialFormat, isTitleNaN, numberWithCommas, getTokenAddressFromId } from '../utils'
import { useSelector } from 'react-redux'
import { usePrevious } from '../hooks'
import { periodSidebarChart } from '../config/settings'

function TopPart(props) {
  const activeToken = useSelector((state) => state.currentToken)
  const dataChart = useSelector((state) => state.dataChart)

  const [liquidityChartData, setLiquidityChartData] = useState([])
  const [volumeChartData, setVolumeChartData] = useState([])
  const [date, setDate] = useState([])
  const [period, setPeriodChart] = useState(9)
  const [color, setColor] = useState()
  const selectedCurrency = useSelector((state) => state.currency)
  const isMobile = useSelector((state) => state.isMobile)
  const currentTradingHistory = useSelector((state) => state.currentTradingHistory)
  const currentPoolActivity = useSelector((state) => state.currentPoolActivity)

  const periodChart = new Date().setDate(new Date().getDate() - period)

  const topPartValue = props.isLeft
    ? selectedCurrency === 'USD'
      ? activeToken.liquidityUSD
      : activeToken.liquidityETH
    : selectedCurrency === 'USD'
    ? activeToken['volume24hUSD']
    : activeToken['volume24hETH']
  const prevTopPartValue = usePrevious(topPartValue)

  const generateChartData = () => {
    if (dataChart) {
      let liquidityChartData = []
      let volumeChartData = []
      let date = []
      dataChart
        .filter((item) => 1000 * item.date > periodChart)
        .forEach((item) => {
          liquidityChartData.push(item.liquidity)
          volumeChartData.push(item.volume)
          date.push(changeFormatDateChart(item.date))
        })
      setLiquidityChartData(liquidityChartData)
      setVolumeChartData(volumeChartData)
      setDate(date)
    }
  }

  const changeFormatDateChart = (date) => {
    const months = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ]
    return `${new Date(1000 * date).getDate()} ${months[new Date(1000 * date).getMonth()]}`
  }

  const selectPeriod = (event) => {
    const parent = event.target.closest('.group-button-purple')
    const buttons = parent.querySelectorAll('.button')
    const gridButtonItems = [].slice.call(buttons)
    gridButtonItems.forEach(function (item) {
      if (item.classList.contains('active')) {
        item.classList.remove('active')
      }
    })
    event.target.classList.add('active')

    const value = event.target.dataset.period
    setPeriodChart(+value)
  }

  useEffect(() => {
    const animatedColor = getAnimatedColor()
    setColor(animatedColor)
  }, [currentTradingHistory, currentPoolActivity])

  useEffect(() => {
    generateChartData()
  }, [dataChart, period])

  const getAnimatedColor = () => {
    if (!props.isLeft && currentTradingHistory && currentTradingHistory[0]) {
      const tokenInAddress =
        currentTradingHistory[0].amount0In > 0
          ? currentTradingHistory[0].token0Address.toLowerCase()
          : currentTradingHistory[0].token1Address.toLowerCase()

      const activeTokenIsTokenIn =
        tokenInAddress === getTokenAddressFromId(activeToken).toLowerCase()
      const animatedColor = activeTokenIsTokenIn ? 'red' : 'green'
      return animatedColor
    }
    if (props.isLeft && currentPoolActivity) {
      return Object(currentPoolActivity[0]).add ? 'green' : 'red'
    }
  }

  return (
    <div className="chart-sidebar">
      <h3 className="head">{props.isLeft ? 'Liquidity' : 'Trading Volume, 24h'}</h3>
      <div className="sum">
        <span className="sign-sum">
          {selectedCurrency === 'USD' && <span className="sign">$</span>}
          <AnimatedNumber
            value={topPartValue}
            prevValue={prevTopPartValue}
            color={color}
            isAnimatedValue={props.isLeft ? currentPoolActivity : currentTradingHistory}
          />
          {selectedCurrency !== 'USD' && <span className="sign">&nbsp;{selectedCurrency}</span>}
        </span>
        <sup
          className={`${
            props.isLeft
              ? activeToken['liquidityChange24h'] >= 0
                ? 'up'
                : 'down'
              : activeToken['volumeChange24h'] >= 0
              ? 'up'
              : 'down'
          }`}
          title={isTitleNaN(
            numberWithCommas(
              props.isLeft
                ? Math.abs(activeToken['liquidityChange24h']) * 100
                : Math.abs(activeToken['volumeChange24h']) * 100
            )
          )}>
          {props.isLeft
            ? financialFormat(Math.abs(activeToken['liquidityChange24h']) * 100, 2)
            : financialFormat(Math.abs(activeToken['volumeChange24h']) * 100, 2)}
          %
        </sup>
      </div>
      {!isMobile && (
        <React.Fragment>
          <div className="top-chart-wrap">
            {/*<div className="icon-block"> <div className="icon">{<Whale /> }</div>  </div> */}
            <div className="button-wrap">
              <div className="group-button-purple">
                <button data-period={9} className="button purple active" onClick={selectPeriod}>
                  1 week
                </button>

                <button
                  data-period={periodSidebarChart}
                  className="button purple"
                  onClick={selectPeriod}>
                  All Time
                </button>
              </div>
            </div>
          </div>
          <div className="chart">
            <Chart
              color={props.isLeft ? '#FF646D' : '#46A6FF'}
              date={date}
              data={props.isLeft ? liquidityChartData : volumeChartData}
              currency={selectedCurrency}
            />
          </div>{' '}
        </React.Fragment>
      )}
    </div>
  )
}

export default TopPart
