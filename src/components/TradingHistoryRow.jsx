import React, { useEffect } from 'react'
import { BigNumber } from 'bignumber.js'
import {
  replaceWrapperTokenToToken,
  isTitleNaN,
  financialFormatRound,
  financialFormatRoundUSD,
  numberWithCommas,
  getConvertedTime,
  getTokenAddressFromId,
} from '../utils'
import { blockExplorerUrls } from '../config/settings'
import { useSelector } from 'react-redux'
import TraderCategory from './TraderCategory'
import { SIDEBARS_ANIMATIONS_TIMEOUT } from '../config/settings'

export default function TradingHistoryRow(props) {
  const activeToken = useSelector((state) => state.currentToken)
  const tokenNetwork = activeToken.network
  const selectedCurrency = useSelector((state) => state.currency)

  useEffect(() => {
    const timer = setTimeout(updateAnimated, SIDEBARS_ANIMATIONS_TIMEOUT)
    return () => clearTimeout(timer)
  }, [props.countNewRow])

  const updateAnimated = () => {
    const tradingRow = document.querySelectorAll('.trading-trow')
    const tradingRowItems = [].slice.call(tradingRow)
    tradingRowItems.forEach((item) => {
      if (item.classList.contains('fade-enter-done')) item.classList.remove('fade-enter-done')
    })
    props.setCountNewRow(-1)
  }

  const tokenOut = props.amount0Out > 0 ? props.amount0Out : props.amount1Out
  const tokenIn = props.amount0In > 0 ? props.amount0In : props.amount1In
  const tokenInAddress =
    props.amount0In > 0 ? props.token0Address.toLowerCase() : props.token1Address.toLowerCase()

  const activeTokenIsTokenIn = tokenInAddress === getTokenAddressFromId(activeToken).toLowerCase()
  const deltaClassName = activeTokenIsTokenIn ? 'down' : 'up'

  return (
    <a
      href={`${blockExplorerUrls[tokenNetwork]}/tx/${props.transactionAddress}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`trading-trow ${deltaClassName} ${props.classAnimated}`}>
      <div className="trading-trow-item">
        <div className={`amount-value ${deltaClassName} `}>
          <div title={isTitleNaN(numberWithCommas(tokenIn))}>
            {financialFormatRound(new BigNumber(tokenIn))}
          </div>
          <div title={isTitleNaN(numberWithCommas(tokenOut))}>
            {financialFormatRound(new BigNumber(tokenOut))}
          </div>
        </div>
        <div className="amount-symbol">
          <div>
            <span
              className="name text-overflow"
              title={replaceWrapperTokenToToken(
                props.amount0In > 0 ? props.token0Symbol : props.token1Symbol
              )}>
              {replaceWrapperTokenToToken(
                props.amount0In > 0 ? props.token0Symbol : props.token1Symbol
              )}
            </span>
          </div>
          <div>
            <span
              className="name text-overflow"
              title={replaceWrapperTokenToToken(
                props.amount0Out > 0 ? props.token0Symbol : props.token1Symbol
              )}>
              {replaceWrapperTokenToToken(
                props.amount0Out > 0 ? props.token0Symbol : props.token1Symbol
              )}
            </span>
          </div>
        </div>
        <div
          className="value"
          title={isTitleNaN(
            selectedCurrency === 'USD'
              ? numberWithCommas(props.amountUSD)
              : numberWithCommas(props.amountETH)
          )}>
          {selectedCurrency === 'USD' && <span className="sign">$</span>}
          {selectedCurrency === 'USD'
            ? financialFormatRoundUSD(new BigNumber(props.amountUSD))
            : financialFormatRound(new BigNumber(props.amountETH))}
          {selectedCurrency !== 'USD' && <span className="sign">&nbsp;{selectedCurrency}</span>}
        </div>
        <div className="emoji">
          <div className="icon">
            <TraderCategory walletCategory={props.walletCategory} />
          </div>
        </div>
        <div className="time">{getConvertedTime(new Date(1000 * props.timestamp))}&nbsp;ago</div>
      </div>
    </a>
  )
}
