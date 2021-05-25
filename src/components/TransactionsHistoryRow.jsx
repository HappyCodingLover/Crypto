import React, { useEffect } from 'react'
import { BigNumber } from 'bignumber.js'
import {
  isTitleNaN,
  financialFormatRound,
  getShortAccount,
  numberWithCommas,
  getTokenAddressFromId,
  getConvertedTime,
} from '../utils'
import { blockExplorerUrls } from '../config/settings'
import { useSelector } from 'react-redux'
import TraderCategory from './TraderCategory'
import { ammConfig } from '../config/amm'
import classNames from 'classnames'

export default function TransactionsHistoryRow(props) {
  const activeToken = useSelector((state) => state.currentToken)
  const selectedCurrency = useSelector((state) => state.currency)

  useEffect(() => {
    const timer = setTimeout(updateAnimated, 5000)
    return () => clearTimeout(timer)
  }, [props.countNewRow])

  const updateAnimated = () => {
    const tradingRow = document.querySelectorAll('.transaction-trow')
    const tradingRowItems = [].slice.call(tradingRow)
    tradingRowItems.forEach((item) => {
      if (item.classList.contains('fade-enter-done')) item.classList.remove('fade-enter-done')
    })
    props.setCountNewRow(-1)
  }

  const tokenOut = props.amount0Out > 0 ? props.amount0Out : props.amount1Out
  const tokenOutName = props.amount0Out > 0 ? props.token0Symbol : props.token1Symbol
  const tokenIn = props.amount0In > 0 ? props.amount0In : props.amount1In
  const tokenInName = props.amount0In > 0 ? props.token0Symbol : props.token1Symbol
  const tokenInAddress =
    props.amount0In > 0 ? props.token0Address.toLowerCase() : props.token1Address.toLowerCase()

  const activeTokenIsTokenIn = tokenInAddress === getTokenAddressFromId(activeToken).toLowerCase()
  const deltaClassName = activeTokenIsTokenIn ? 'down' : 'up'

  const IconAMM = ammConfig(props.AMM).icon
  return (
    <a
      href={`${blockExplorerUrls[props.network]}tx/${props.transactionAddress}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`transaction-trow ${deltaClassName} ${props.classAnimated}`}>
      <div className="dex">
        <IconAMM />
      </div>
      <div className={classNames('delta', `delta--${deltaClassName}`)}></div>
      <div className="trade">
        {selectedCurrency === 'USD' ? (
          <div title={isTitleNaN(numberWithCommas(props.amountUSD))}>
            <span className="sign">$</span>
            <span className="value">{financialFormatRound(new BigNumber(props.amountUSD))}</span>
          </div>
        ) : (
          <div title={isTitleNaN(numberWithCommas(props.amountETH))}>
            <span className="value">{financialFormatRound(new BigNumber(props.amountETH))}</span>
            <span className="sign">ETH</span>
          </div>
        )}
      </div>
      <div className="sold">
        <span className="value name text-overflow" title={tokenIn}>
          {financialFormatRound(tokenIn)}
        </span>
        &nbsp;<span className="token-name text-overflow">{tokenInName}</span>
      </div>

      <div className="bought">
        <span className="value name text-overflow" title={tokenOut}>
          {financialFormatRound(tokenOut)}
        </span>
        &nbsp;<span className="token-name text-overflow">{tokenOutName}</span>
      </div>

      <div className="account">
        <span title={props.walletAddress}>
          {props.walletAddress && getShortAccount(props.walletAddress)}
        </span>
      </div>
      <div className="icon">
        <TraderCategory walletCategory={props.walletCategory} />
      </div>
      <div className="time">{getConvertedTime(new Date(1000 * props.timestamp))}&nbsp;ago</div>
    </a>
  )
}
