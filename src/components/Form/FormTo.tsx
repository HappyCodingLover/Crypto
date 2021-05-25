import classNames from 'classnames'
import IconTokenComponent from '../IconTokenComponent'
import {
  financialFormat,
  isTitleNaN,
  numberWithCommas,
  replaceWrapperTokenToToken,
} from '../../utils'
import DropdownForm from '../DropdownForm'
import AnimatedInput from '../AnimatedInput'
import React from 'react'
import { Token, TradeType } from '../../index'
import BigNumber from 'bignumber.js'

interface FormToProps {
  onFocusInput: boolean
  tradeType: TradeType
  isLoading: boolean
  isEmpty: boolean
  isMobile: boolean
  setTokenFrom: (token: Token) => void
  setTokenTo: (token: Token) => void
  tokenFrom?: Token
  tokenTo?: Token
  IconTokenFrom: React.ReactNode
  IconTokenTo: React.ReactNode
  estimatedTo: BigNumber
}

const FormTo = ({
  onFocusInput,
  tradeType,
  isEmpty,
  isLoading,
  isMobile,
  setTokenFrom,
  setTokenTo,
  tokenFrom,
  tokenTo,
  IconTokenFrom,
  IconTokenTo,
  estimatedTo,
}: FormToProps) => (
  <div className="form-row">
    <div className="form-row-title">
      <span>To</span>
    </div>
    <div
      className={classNames('input-border', {
        'input-rainbow': onFocusInput && !isLoading && !isEmpty,
      })}>
      <div
        className={classNames(
          `input-wrapper ${tradeType === 'Sell' && !isMobile ? 'up-drop' : 'down-drop'}`
        )}>
        {tradeType !== 'Sell' ? (
          <div className="token">
            <span className={`icon token-border-network ${tokenTo?.network}`}>
              <div className="token-border small">
                <IconTokenComponent IconToken={IconTokenTo} symbol={tokenTo?.symbol} />
              </div>
            </span>
            <span
              className="name text-overflow"
              title={replaceWrapperTokenToToken(tokenTo?.symbol)}>
              {replaceWrapperTokenToToken(tokenTo?.symbol)}
            </span>
          </div>
        ) : (
          <DropdownForm
            tradeType={tradeType}
            setTokenFrom={setTokenFrom}
            setTokenTo={setTokenTo}
            IconTokenFrom={IconTokenFrom}
            IconTokenTo={IconTokenTo}
            tokenTo={tokenTo}
            tokenFrom={tokenFrom}
          />
        )}
        {isLoading ? (
          <AnimatedInput />
        ) : (
          <input
            readOnly
            className={` ${isEmpty ? 'grey-nulls' : ''} `}
            title={isTitleNaN(numberWithCommas(estimatedTo.toFixed()))}
            value={!isEmpty ? financialFormat(estimatedTo.toFixed()) : '0.0'}
          />
        )}
      </div>
    </div>
  </div>
)

export default FormTo
