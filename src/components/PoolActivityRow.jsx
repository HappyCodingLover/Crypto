import React, { useEffect } from 'react'
import { BigNumber } from 'bignumber.js'
import {
  financialFormatRound,
  financialFormatRoundUSD,
  replaceWrapperTokenToToken,
  numberWithCommas,
  isTitleNaN,
  getConvertedTime,
} from '../utils'
import { useSelector } from 'react-redux'
import { blockExplorerUrls } from '../config/settings'
import Elephant from '../images/icons/emoji/elephant.svg'
import { SIDEBARS_ANIMATIONS_TIMEOUT } from '../config/settings'

export default function PoolActivityRow(props) {
  const selectedCurrency = useSelector((state) => state.currency)
  const activeToken = useSelector((state) => state.currentToken)
  const tokenNetwork = activeToken.network

  useEffect(() => {
    const timeout = setTimeout(updateAnimatedActivity, SIDEBARS_ANIMATIONS_TIMEOUT)
    return () => clearTimeout(timeout)
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
  return (
    <a
      href={`${blockExplorerUrls[tokenNetwork]}/tx/${props.transactionAddress}`}
      target="_blank"
      rel="noopener noreferrer"
      className={`liquidity-trow ${signClass} ${classAnimated}`}>
      <div className="sign-math"></div>
      <div className="amount-value">
        <div title={isTitleNaN(numberWithCommas(props.amount0))}>
          <span>{financialFormatRound(new BigNumber(props.amount0))}</span>
        </div>
        <div title={isTitleNaN(numberWithCommas(props.amount1))}>
          <span>{financialFormatRound(new BigNumber(props.amount1))}</span>
        </div>
      </div>
      <div className="amount-symbol">
        <div>
          &nbsp;
          <span
            className="name text-overflow"
            title={replaceWrapperTokenToToken(props.token0Symbol)}>
            {replaceWrapperTokenToToken(props.token0Symbol)}
          </span>
        </div>
        <div>
          &nbsp;
          <span
            className="name text-overflow"
            title={replaceWrapperTokenToToken(props.token1Symbol)}>
            {replaceWrapperTokenToToken(props.token1Symbol)}
          </span>
        </div>
      </div>

      <div
        className="total"
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
