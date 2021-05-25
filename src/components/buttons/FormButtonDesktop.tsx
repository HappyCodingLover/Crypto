import React, { useEffect, useState } from 'react'
import { replaceWrapperTokenToToken } from '../../utils'
import classNames from 'classnames'
import TapToApproveButton from './TapToApproveButton'
import { TradeType, Token } from '../../index'

interface FormButtonDesktopProps {
  tokenTo?: Token
  tokenFrom?: Token
  disabled: boolean
  errorMsg?: string
  type: TradeType
  isTokenApproved: boolean
  isLoading: boolean
  isInputEmpty: boolean
  quoteNeeded: boolean
  accountConnected: boolean
  onSwapClick: (e: any) => void
  onRefreshQuote: () => void
  onApproveClick: (e: any) => void
}

interface ButtonContentProps {
  errorMsg?: string
  type: TradeType
  tokenTo?: Token
  tokenFrom?: Token
  isTokenApproved: boolean
  disabled: boolean
  isLoading: boolean
  accountConnected: boolean
  approvalMode: boolean
}

const FormButtonDesktop = ({
  disabled,
  onSwapClick,
  errorMsg,
  tokenTo,
  tokenFrom,
  type,
  isTokenApproved,
  onApproveClick,
  isLoading,
  isInputEmpty,
  quoteNeeded,
  onRefreshQuote,
  accountConnected,
}: FormButtonDesktopProps) => {
  const [approvalMode, setApprovalMode] = useState(false)

  useEffect(() => {
    if (!isLoading) {
      setApprovalMode(false)
    }
  }, [isLoading])

  const onClick = (e: any) => {
    isTokenApproved ? onSwapClick(e) : onApproveClick(e)
  }

  const showRefreshQuote = quoteNeeded && !errorMsg && !isLoading

  return (
    <div className="infinity-button-container">
      {showRefreshQuote && (
        <TapToApproveButton
          tradeType={type}
          disabled={disabled}
          onClick={onRefreshQuote}
          text="Click to Refresh Quote"
        />
      )}
      {!showRefreshQuote && (
        <button
          className={classNames('button', `_${type.toLowerCase()}`, {
            negative: isLoading,
          })}
          disabled={disabled}
          onMouseEnter={() => setApprovalMode(!isTokenApproved)}
          onMouseLeave={() => setApprovalMode(!isTokenApproved && isLoading)}
          onClick={onClick}>
          <ButtonContent
            approvalMode={approvalMode}
            errorMsg={errorMsg}
            type={type}
            tokenTo={tokenTo}
            tokenFrom={tokenFrom}
            isTokenApproved={isTokenApproved}
            disabled={disabled}
            isLoading={isLoading}
            accountConnected={accountConnected}
          />
        </button>
      )}
      <div
        className={classNames('info-message', {
          disabled: isTokenApproved || disabled || !accountConnected || isInputEmpty,
        })}>
        You'll need to approve token spending first
      </div>
    </div>
  )
}

const ButtonContent = ({
  errorMsg,
  type,
  tokenTo,
  tokenFrom,
  isTokenApproved,
  disabled,
  approvalMode,
  isLoading,
  accountConnected,
}: ButtonContentProps) => {
  const printButtonText = () => {
    if (errorMsg) {
      return <span>{errorMsg}</span>
    }

    const token =
      type === 'Buy'
        ? replaceWrapperTokenToToken(tokenTo?.symbol)
        : replaceWrapperTokenToToken(tokenFrom?.symbol)

    const showApprovalButton =
      accountConnected && (isLoading || (approvalMode && !isTokenApproved && !disabled))

    if (showApprovalButton) {
      return (
        <div className="button-content">
          <div>
            <span className={classNames('step-number', `_${type.toLowerCase()}`)}>1</span>
            <span>Approve</span>
          </div>
          <div className="infinity-container">
            <svg
              className={classNames('infinity-spinner', `_${type.toLowerCase()}`, {
                hidden: !isLoading,
              })}
              xmlns="http://www.w3.org/2000/svg"
              width="42"
              height="20">
              <path
                fill="none"
                strokeWidth="3"
                d="M21 10l5.4 5.8c1.5 1.5 3.4 2.2 5.5 2.2 4.4 0 8-3.6 8-8s-3.6-8-8-8c-2.1 0-4 .7-5.5 2.2 0 0-9.2 10.2-10.9 11.6-1.1.9-1.7 1.2-1.9 1.4 0 0-1.7.8-3.6.8-2.9 0-8-2.8-8-8s5.1-8 8-8c1.9 0 3.6.8 3.6.8.9.5 1.5 1 1.9 1.4 2.3 2 4.4 4.5 5.5 5.8"
              />
            </svg>
          </div>
          <div>
            <span className={classNames('step-number', `_${type.toLowerCase()}`)}>2</span>
            <span>
              {type} {token}
            </span>
          </div>
        </div>
      )
    }

    return (
      <React.Fragment>
        {type} {token}
      </React.Fragment>
    )
  }

  return printButtonText()
}

export default FormButtonDesktop
