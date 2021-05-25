import React, { useEffect } from 'react'
import { BigNumber } from 'bignumber.js'
import {
  financialFormatRound,
  getShortAccount,
  numberWithCommas,
  isTitleNaN,
  getConvertedTime,
} from '../utils'
import { blockExplorerUrls } from '../config/settings'

import { useSelector } from 'react-redux'
import Elephant from '../images/icons/emoji/elephant.svg'
import { ammConfig } from '../config/amm'

export default function PoolActivityRow(props) {
  const selectedCurrency = useSelector((state) => state.currency)
  const activeToken = useSelector((state) => state.currentToken)

  useEffect(() => {
    const interval = setTimeout(updateAnimatedActivity, 5000)
    return () => clearInterval(interval)
  }, [props.countNewRowActivity])

  const updateAnimatedActivity = () => {
    const liquidityRow = document.querySelectorAll('.liquidity-trow')
    const liquidityRowItems = [].slice.call(liquidityRow)
    liquidityRowItems.forEach((item) => {
      if (item.classList.contains('fade-enter-done')) item.classList.remove('fade-enter-done')
    })
    props.setСountNewRowActivity(-1)
  }

  const signClass = props.add ? 'up' : 'down'
  const classAnimated = props.countNewRowActivity >= props.index ? 'fade-enter-done' : ''
  const totalLiquidity =
    selectedCurrency === 'USD' ? activeToken.liquidityUSD : activeToken.liquidityETH
  const percentOfTotalLiquidity = totalLiquidity / 100
  const totalValue = selectedCurrency === 'USD' ? props.amountUSD : props.amountETH
  const minTotalValue = 10000

  const IconAMM = ammConfig(props.AMM).icon
  return (
    <a
      href={`${blockExplorerUrls[props.network]}tx/${props.transactionAddress}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`liquidity-trow transaction-trow ${signClass} ${classAnimated}`}>
      <div className="dex">
        <IconAMM />
      </div>
      <div className="delta">
        <div className="sign-math"></div>
      </div>
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
        <span className="value name text-overflow" title={props.amount0}>
          {financialFormatRound(props.amount0)}
        </span>
        &nbsp;<span className="token-name text-overflow">{props.token0Symbol}</span>
      </div>

      <div className="bought">
        <span className="value name text-overflow" title={props.amount1}>
          {financialFormatRound(props.amount1)}
        </span>
        &nbsp;<span className="token-name text-overflow">{props.token1Symbol}</span>
      </div>
      <div className="account">
        <span title={props.walletAddress}>
          {props.walletAddress && getShortAccount(props.walletAddress)}
        </span>
      </div>
      <div className="icon">
        {percentOfTotalLiquidity < totalValue && minTotalValue < totalValue && (
          <Elephant
            data-tip="Whale LP moving 1%+ of existing pool liquidity"
            data-for="sidebar-liquidity-tooltip"
          />
        )}
      </div>
      <div className="time">{getConvertedTime(new Date(1000 * props.timestamp))}&nbsp;ago</div>
    </a>
  )
}
