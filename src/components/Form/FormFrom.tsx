import {
    financialFormat,
    getTokenAddressFromId,
    isTitleNaN,
    numberWithCommas,
    replaceWrapperTokenToToken,
} from '../../utils'
import IconTokenComponent from '../IconTokenComponent'
import DropdownForm from '../DropdownForm'
import React, { ChangeEvent } from 'react'
import { Token, TradeType } from '../../index'
import BigNumber from 'bignumber.js'
import { WBNB_ADDRESS, WETH_ADDRESS } from '../../config/tokens'
import { GAS_BUFFER_BSC, GAS_BUFFER_ETH } from '../../config/settings'

interface FormFromProps {
    account: any
    tokenFrom?: Token
    tokenTo?: Token
    tokenNetwork: string
    walletNetwork?: string
    onPercentUpdate: (percent: number, value: string) => void
    userBalance: BigNumber
    onFocusInput: boolean
    IconTokenFrom: React.ReactNode
    IconTokenTo: React.ReactNode
    tradeType: TradeType
    setTokenFrom: (token: Token) => void
    setTokenTo: (token: Token) => void
    debouncedText: string
    isEmpty: boolean
    onFromInputChange: (event: ChangeEvent<HTMLInputElement>) => void
    onBlur: () => void
    onFocus: () => void
    fromInputValue: string
    fromInputValueText: string
    openProviderMenu: () => void
}

const FormFrom = ({
                      account,
                      tokenFrom,
                      tokenTo,
                      tokenNetwork,
                      walletNetwork,
                      onPercentUpdate,
                      userBalance,
                      onFocusInput,
                      IconTokenFrom,
                      tradeType,
                      setTokenFrom,
                      setTokenTo,
                      IconTokenTo,
                      isEmpty,
                      debouncedText,
                      onFromInputChange,
                      onBlur,
                      onFocus,
                      fromInputValueText,
                      fromInputValue,
                      openProviderMenu,
                  }: FormFromProps) => {
    const onPercentButtonClick = (event: any) => {
        if (!tokenFrom?.id) {
            return
        }

        if (!account) {
            openProviderMenu()
            return
        }

        const percent = parseFloat(event.target.dataset.percent)
        const tokenFromAddress = getTokenAddressFromId(tokenFrom)
        let gasBuffer = new BigNumber(0)
        if (tokenFromAddress === WETH_ADDRESS && tokenNetwork === 'eth') {
            if (userBalance <= GAS_BUFFER_ETH) {
                gasBuffer = new BigNumber(0)
                return
            }
            gasBuffer = new BigNumber(5 * 10 ** 16).div(10 ** 18)
        }
        if (tokenFromAddress === WBNB_ADDRESS && tokenNetwork === 'bsc') {
            if (userBalance <= GAS_BUFFER_BSC) {
                gasBuffer = new BigNumber(0)
                return
            }
            gasBuffer = new BigNumber(2 * 10 ** 16).div(10 ** 18)
        }

        const value =
            percent === 1
                ? userBalance
                    .minus(gasBuffer)
                    .times(percent)
                    .decimalPlaces(userBalance?.gte(1) ? 2 : 4, 1)
                    .toFixed()
                : userBalance.times(percent).toFixed()

        onPercentUpdate(percent, value)
    }

    return (
        <div className="form-row">
            <div className="form-row-title">
                <span>From</span>
                {account && tokenFrom && tokenNetwork === walletNetwork && (
                    <span
                        role="button"
                        data-percent={1}
                        onClick={onPercentButtonClick}
                        className="value-grey pointer"
                        title={isTitleNaN(userBalance.gt(0) ? userBalance.toFixed() : 0)}>
            {financialFormat(userBalance.decimalPlaces(userBalance?.gt(1) ? 2 : 4, 1).toFixed())}
                        &nbsp;
                        <span
                            data-percent={1}
                            onClick={onPercentButtonClick}
                            title={replaceWrapperTokenToToken(tokenFrom.symbol)}>
              {replaceWrapperTokenToToken(tokenFrom.symbol)}
            </span>
          </span>
                )}
            </div>
            <div className={`input-border ${onFocusInput ? 'input-rainbow' : ''}`}>
                <div className={`input-wrapper ${tradeType === 'Buy' ? 'down-drop' : ''}`}>
                    {tradeType !== 'Buy' ? (
                        <div className="token">
              <span className={`icon token-border-network ${tokenFrom?.network}`}>
                <div className="token-border small">
                  <IconTokenComponent IconToken={IconTokenFrom} symbol={tokenFrom?.symbol} />
                </div>
              </span>
                            <span
                                className="name text-overflow"
                                title={replaceWrapperTokenToToken(tokenFrom?.symbol)}>
                {replaceWrapperTokenToToken(tokenFrom?.symbol)}
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
                    <input
                        className={`${isEmpty ? 'grey-nulls' : ''} `}
                        type="text"
                        step="any"
                        title={isTitleNaN(numberWithCommas(debouncedText))}
                        onChange={onFromInputChange}
                        onBlur={onBlur}
                        onFocus={onFocus}
                        placeholder="0.0"
                        value={isEmpty ? '' : numberWithCommas(fromInputValueText || fromInputValue)}
                    />
                </div>
            </div>
            <div className="group-button-wrapper">
                <div className="group-button">
                    <button
                        className="button percent"
                        data-percent={0.25}
                        onClick={onPercentButtonClick}
                        disabled={userBalance.isLessThanOrEqualTo(0)}>
                        25%
                    </button>
                    <button
                        className="button percent"
                        data-percent={0.5}
                        onClick={onPercentButtonClick}
                        disabled={userBalance.isLessThanOrEqualTo(0)}>
                        50%
                    </button>
                    <button
                        className="button percent"
                        data-percent={0.75}
                        onClick={onPercentButtonClick}
                        disabled={userBalance.isLessThanOrEqualTo(0)}>
                        75%
                    </button>
                    <button
                        className="button percent"
                        data-percent={1}
                        onClick={onPercentButtonClick}
                        disabled={userBalance.isLessThanOrEqualTo(0)}>
                        100%
                    </button>
                </div>
            </div>
        </div>
    )
}

export default FormFrom
