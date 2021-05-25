import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import ChartFull from './ChartFull'
import AnimatedNumber from './AnimatedNumber'
import { dexGuruAPIUrl } from '../config/settings'
import { ammConfig } from '../config/amm'

import { financialFormat, isTitleNaN, numberWithCommas, getShortNumber } from '../utils'
import { useSelector } from 'react-redux'
import { usePrevious } from '../hooks'
import { periodSidebarChart } from '../config/settings'
import { State } from '../reducers'
import { AMM, TokenNetwork } from '../index'
import groupBy from 'lodash.groupby'
import { apiFetch } from '../dexguruFetch'

interface TopPartFullProps {
  isLeft: boolean
  openSidebar: () => void
}

type ConfigChart = {
  period: number
  interval: string
}

export type AmmDetails = {
  AMM: AMM // 'pancakeswap_v2'
  dailyTxns: number // 92229
  dailyVolumeUSD: number // 85785656.08746852
  date: number // 1620864000
  id: string // '0x2170ed0880ac9a755fd29b2688956bd959f933f8-1620864000'
  liquidity: number // 21244317.63019543
  network: TokenNetwork // 'bsc'
  totalLiquidityUSD: number // 21244317.63019543
  volume: number // 85785656.08746852
}

type AmmBtn = { [amm: string]: boolean }

function TopPartFull(props: TopPartFullProps) {
  const activeToken = useSelector((state: State) => state.currentToken)
  const [date, setDate] = useState<string[]>([]) // dates in form like "10 September"
  const [configChart, setConfigChart] = useState<ConfigChart>({ period: 7, interval: 'day' })
  const [color, setColor] = useState<string>()
  const [dataChartFull, setDataChartFull] = useState<AmmDetails[]>([])
  const [chartDataGroupedByAmm, setChartDataGroupedByAmm] = useState<{
    [amm: string]: AmmDetails[]
  }>({})
  const [ammBtns, setAmmBtns] = useState<AmmBtn>({})

  const selectedCurrency = useSelector((state: State) => state.currency)
  const currentTradingHistory = useSelector((state: State) => state.currentTradingHistory)

  const topPartValue = props.isLeft
    ? selectedCurrency === 'USD'
      ? activeToken.liquidityUSD
      : activeToken.liquidityETH
    : selectedCurrency === 'USD'
    ? activeToken['volume24hUSD']
    : activeToken['volume24hETH']
  const prevTopPartValue = usePrevious(topPartValue)

  const getChartData = async () => {
    const beginTimestamp = Math.floor(
      new Date().setDate(new Date().getDate() - configChart.period) / 1000
    )
    const endTimestamp = Math.floor(Date.now() / 1000)
    const url = `${dexGuruAPIUrl}/tokens/${activeToken.id}/history?amm=all&begin_timestamp=${beginTimestamp}&end_timestamp=${endTimestamp}&interval=${configChart.interval}`

    const response = await apiFetch(url)
    if (!response) {
      return
    }
    setDataChartFull(response.data)
  }

  useEffect(() => {
    getChartData()
  }, [activeToken.id, configChart])

  const generateChartData = () => {
    if (dataChartFull) {
      const groupedByAmm = groupBy<AmmDetails>(dataChartFull, (x) => x.AMM)
      // for example groupedByAmm = {uniswap: Array(8), sushiswap: Array(8)}
      const ammBtns: AmmBtn = {}
      Object.keys(groupedByAmm).forEach((amm) => (ammBtns[amm] = true))
      setAmmBtns(ammBtns)
      const date = dataChartFull
        .map((item: AmmDetails) => item.date)
        .filter((x, i, a) => a.indexOf(x) === i)
        .map((date) => changeFormatDateChart(date))
      setChartDataGroupedByAmm(groupedByAmm)
      setDate(date)
    }
  }

  const changeFormatDateChart = (date: number) => {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ]
    return `${new Date(1000 * date).getDate()} ${months[new Date(1000 * date).getMonth()]}`
  }

  const onChangePeriod = (event: React.MouseEvent<HTMLButtonElement>) => {
    const button = event.currentTarget
    if (!button || !button.dataset.period || !button.dataset.interval) {
      return
    }
    const period = parseInt(button.dataset.period)
    const interval = button.dataset.interval
    setConfigChart({ period: period, interval: interval })
  }

  useEffect(() => {
    const animatedColor = getAnimatedColor()
    setColor(animatedColor)
  }, [])

  useEffect(() => {
    const animatedColor = getAnimatedColor()
    setColor(animatedColor)
  }, [activeToken])

  useEffect(() => {
    generateChartData()
  }, [dataChartFull, configChart])

  const getAnimatedColor = () => {
    if (currentTradingHistory)
      return Object(currentTradingHistory[0]).amount0In > 0 ? 'green' : 'red'
  }

  const toggleAmmBtn = (e: React.MouseEvent<HTMLElement>) => {
    const element = e.currentTarget
    const amm = element?.getAttribute('data-amm')
    if (!amm) {
      return
    }
    const ammsSelected = Object.keys(ammBtns).filter((key) => ammBtns[key] === true)
    if (ammsSelected.length === 1 && ammsSelected[0] === amm) {
      return null
    }
    if (ammsSelected.length === Object.keys(ammBtns).length) {
      const newAmmBtns: AmmBtn = {}
      Object.keys(ammBtns).forEach((key) => (newAmmBtns[key] = amm === key))
      setAmmBtns(newAmmBtns)
    } else {
      setAmmBtns({ ...ammBtns, [amm]: !ammBtns[amm] })
    }
  }

  const onSelectAllAmms = () => {
    let newAmmBtns: AmmBtn = {}
    Object.keys(ammBtns).forEach((key) => (newAmmBtns[key] = true))
    setAmmBtns(newAmmBtns)
  }

  const configButtonsAMM = [
    {
      period: 1,
      interval: 'hour',
      inner: '24 h',
    },
    {
      period: 7,
      interval: 'day',
      inner: '1 week',
    },
    {
      period: 30,
      interval: 'day',
      inner: '30 days',
    },
    {
      period: periodSidebarChart,
      interval: 'day',
      inner: 'All Time',
    },
  ]
  const groupButtonsChart = configButtonsAMM.map((item) => {
    return (
      <button
        data-period={item.period}
        data-interval={item.interval}
        className={classNames('button purple', { active: item.period === configChart.period })}
        key={item.period}
        onClick={onChangePeriod}>
        {item.inner}
      </button>
    )
  })

  return (
    <div className="chart-part-full">
      <div className="top-sidebar">
        <div className="top-sidebar-title">
          <h3 className="head">{props.isLeft ? 'Liquidity' : 'Trading Volume'}</h3>
          <div className="sum">
            <span className="sign-sum">
              {selectedCurrency === 'USD' && <span className="sign">$</span>}
              <AnimatedNumber
                value={topPartValue}
                prevValue={prevTopPartValue}
                color={color}
                isAnimatedValue
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
        </div>
        <div className="top-sidebar-buttons">
          <div className="group-button-purple">{groupButtonsChart}</div>
        </div>
        <div className="chart">
          <ChartFull
            ammChartsConfig={ammConfig}
            date={date}
            ammBtns={ammBtns}
            isLeft={props.isLeft}
            chartDataGroupedByAmm={chartDataGroupedByAmm}
            currency={selectedCurrency}
          />
        </div>
      </div>
      <div className="spread">
        <div className="spread__header">
          <div className="title">Distribution:</div>
          <button className="select-all" onClick={onSelectAllAmms}>
            Select All
          </button>
        </div>
        <div className="blocks-and-btn-wrapper">
          <div className="blocks">
            {Object.keys(chartDataGroupedByAmm).map((amm) => {
              const IconAmm = ammConfig(amm).icon
              return (
                <div
                  className={`block ${ammBtns[amm] === true ? 'active' : ''}`}
                  title={amm}
                  style={{
                    borderColor:
                      ammBtns[amm] === true ? `${ammConfig(amm).borderColor}` : 'transparent',
                  }}
                  key={amm}
                  data-amm={amm}
                  onClick={toggleAmmBtn}>
                  <div
                    className="point"
                    style={{ backgroundColor: `${ammConfig(amm).borderColor}` }}
                  />
                  <div className="block-row">
                    <div className="icon-token">
                      <IconAmm />
                    </div>
                    <div className="network text-overflow">
                      {amm.charAt(0).toUpperCase() + amm.slice(1)}
                    </div>
                  </div>
                  <div className="block-row">
                    <div className="sum">
                      $
                      {props.isLeft
                        ? getShortNumber(
                            chartDataGroupedByAmm[amm][chartDataGroupedByAmm[amm].length - 1]
                              .totalLiquidityUSD,
                            2
                          )
                        : getShortNumber(
                            chartDataGroupedByAmm[amm][chartDataGroupedByAmm[amm].length - 1]
                              .dailyVolumeUSD,
                            2
                          )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TopPartFull
