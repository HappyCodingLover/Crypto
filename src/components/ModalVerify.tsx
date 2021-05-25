import React, { useState, useEffect } from 'react'
import { useWeb3React } from '@web3-react/core'
import { useDebounce } from 'use-debounce'
import IconClose from '../images/icons/close.svg'
import IconToolTips from '../images/icons/icon-tooltips.svg'
import Angry from '../images/icons/emoji/angry.svg'
import GasStation from '../images/icons/emoji/gasstation.svg'
import { BigNumber } from 'bignumber.js'
import { useSelector, useDispatch } from 'react-redux'
import Spinner from './Spinner'
import { DEFAULT_TIP, CLOSE_MODAL_TIMEOUT, SLIPPAGE_TAX_WHEN_FEES } from '../config/settings'
import ReactTooltip from 'react-tooltip'
import { usePrevious } from '../hooks'
import ErrorNotification from './ErrorNotification'
import { updateCurrentToken, updateQuoteToken, updateSettings, updateTxn } from '../actions'
import GasFeeOptionsDesktop from './GasFeeOptions/GasFeeOptionsDesktop'
import TipOptionsDesktop from './TipOptions/TipOptionsDesktop'
import LimitsOptionsDesktop from './LimitsOptions/LimitsOptionsDesktop'
import NetworkFeeDesktop from './NetworkFee/NetworkFeeDesktop'
import SwapSummary from './SwapSummary'
import { getGasPriceByKey } from '../helpers/verifyHelpers'
import 'rc-slider/assets/index.css'
import { calculateTokenUsdPrices } from '../services/tokenService'
import { doesTokenHaveFees } from '../services/tokenService'
import { slippageAdjustedMessage } from './LimitsOptions/resources'
import { changeVerificationComplete } from '../actions'
import * as transactionService from '../services/transactionService'
import 'rc-slider/assets/index.css'
import { TxnUpdate } from '../reducers/txn'
import { QuoteTokenState } from '../reducers/quoteToken'
import { CurrentTokenState } from '../reducers/currentToken'
import { State } from '../reducers'
import { GasPrice, QuoteResponse, Token, Transaction } from '../index'

interface ModalVerifyProps {
  closeVerify: () => void
  tokenFrom?: Token
  tokenTo?: Token
}

function ModalVerify({ closeVerify, tokenFrom, tokenTo }: ModalVerifyProps) {
  const reduxDispatch = useDispatch()
  const storedSettings = useSelector((store: State) => store.settings)
  const activeTradeType = useSelector((store: State) => store.activeTradeType)

  const activeToken = useSelector((state: State) => state.currentToken)
  const quoteToken = useSelector((state: State) => state.quoteToken)

  const tokenNetwork = activeToken.network

  const txn: Transaction = useSelector((state: State) => state.txn[activeTradeType])

  const { account, chainId, library } = useWeb3React()
  const tokenPriceUSD = useSelector((state: State) => state.tokenPriceUSD)

  const [quoteResponse, setQuoteResponse] = useState<QuoteResponse | undefined>()
  const [gasPrice, setGasPrice] = useState<GasPrice | undefined>()

  const [fromTokenUsdPrice, setFromTokenUsdPrice] = useState(new BigNumber(0))
  const [toTokenUsdPrice, setToTokenUsdPrice] = useState(new BigNumber(0))

  const [isEnoughEthForGas, setIsEnoughEthForGas] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [gasCosts, setGasCosts] = useState(new BigNumber(0))
  const previousGasCosts = usePrevious(gasCosts)
  const [tip, setTip] = useState(DEFAULT_TIP)
  const [delta, setDelta] = useState(0)
  const [isDeltaShown, setDeltaShown] = useState(false)
  const [toAmount, setToAmount] = useState(new BigNumber(0))
  const previousToAmount = usePrevious(toAmount)
  const [fromAmountSelectedCurrency, setFromAmountSelectedCurrency] = useState<BigNumber>(
    new BigNumber(0)
  )
  const previousFromAmountCurrency = usePrevious(fromAmountSelectedCurrency)
  const [toAmountSelectedCurrency, setToAmountSelectedCurrency] = useState(new BigNumber(0))
  const previousToAmountCurrency = usePrevious(toAmountSelectedCurrency)
  const [hashTransaction, setHashTransaction] = useState<string | undefined>()
  const [errorMsg, setErrorMsg] = useState('')
  const [debouncedTip] = useDebounce(tip, 1000)
  const [tokenHasFees, setTokenHasFees] = useState(false)

  const update = (value: Partial<QuoteTokenState> | Partial<CurrentTokenState>) => {
    if (activeTradeType === 'Buy') {
      reduxDispatch(updateQuoteToken(value))
    } else {
      reduxDispatch(updateCurrentToken(value))
    }
  }

  const {
    hashTxn,
    quoteResponse: storedQuoteResponse,
    gasPrice: storedGasPrice,
    gasCosts: storedGasCost,
    isEnoughEthForGas: isEnoughEthForGasStored,
    txnError,
  } = useSelector((state: State) => state.txn[activeTradeType])

  useEffect(() => {
    if (txnError) {
      setErrorMsg(txnError)
    }
  }, [txnError])

  useEffect(() => {
    setIsEnoughEthForGas(isEnoughEthForGasStored || false)
  }, [isEnoughEthForGasStored])

  useEffect(() => {
    setGasCosts(storedGasCost || new BigNumber(0))
  }, [storedGasCost])

  useEffect(() => {
    setGasPrice(storedGasPrice)
  }, [storedGasPrice])

  useEffect(() => {
    setHashTransaction(hashTxn)
  }, [hashTxn])

  useEffect(() => {
    setQuoteResponse(storedQuoteResponse)
  }, [storedQuoteResponse])

  // <\ verificationService refactoring>

  const init = async () => {
    try {
      setErrorMsg('')

      if (!account) {
        return
      }

      await transactionService.checkTokenAllowance({
        account,
        tokenNetwork,
        tokenFrom,
        library,
        update,
      })

      try {
        const gasPrice: GasPrice | undefined = await transactionService.getGasPriceCalculation({
          tokenNetwork,
        })
        setGasPrice(gasPrice)
      } catch (e) {
        console.error(e)
        return
      }

      if (tokenFrom && tokenTo) {
        const { fromTokenUsdPrice, toTokenUsdPrice } = calculateTokenUsdPrices({
          tokenFrom,
          tokenTo,
        })

        setFromTokenUsdPrice(fromTokenUsdPrice)
        setToTokenUsdPrice(toTokenUsdPrice)
        setIsMounted(true)
      }
    } catch (error) {
      console.error('***', error)
    }
  }

  useEffect(() => {
    init()

    const closeTimeout = window.setTimeout(() => {
      closeVerify()
    }, CLOSE_MODAL_TIMEOUT)

    return () => window.clearTimeout(closeTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const calculateFees = async () => {
      const doesIt: boolean = await doesTokenHaveFees(tokenFrom, tokenTo)
      setTokenHasFees(doesIt)
    }

    calculateFees()
  }, [tokenFrom, tokenTo])

  // TODO: maybe dont need useEffect
  useEffect(() => {
    const newFromAmountSelectedCurrency =
      (fromAmount && fromAmount.times(fromTokenUsdPrice)) || new BigNumber(0)
    setFromAmountSelectedCurrency(newFromAmountSelectedCurrency)
  }, [fromTokenUsdPrice])

  // TODO: maybe dont need useEffect
  useEffect(() => {
    const newToAmountSelectedCurrency = toAmount.times(toTokenUsdPrice)
    setToAmountSelectedCurrency(newToAmountSelectedCurrency)
  }, [toTokenUsdPrice, toAmount])

  // TODO: maybe dont need useEffect
  useEffect(() => {
    if (quoteResponse?.buyAmount) {
      const newToAmount = new BigNumber(quoteResponse.buyAmount).div(10 ** (tokenTo?.decimals || 0))
      setToAmount(newToAmount)
    }
  }, [quoteResponse?.buyAmount, tokenTo])

  const settingChangeHandler = (value: object) => {
    setErrorMsg('')
    reduxDispatch(updateSettings({ ...storedSettings, ...value }))
  }

  useEffect(() => {
    // TODO: all args required need include in condition

    if (quoteResponse?.sellAmount && gasPrice && isMounted && account) {
      setErrorMsg('')

      const slippage = getRightSlippage()

      try {
        transactionService.getSwapEstimateWithGas({
          activeToken,
          tokenPriceUSD,
          slippage,
          tokenFrom,
          tokenTo,
          account,
          tokenNetwork,
          selectedGasPrice: getGasPriceByKey(gasPrice, storedSettings.gasFee),
          debouncedTip,
          sellAmount: new BigNumber(quoteResponse.sellAmount),
          library,
          type: activeTradeType,
          updateTxn: (txn: TxnUpdate) => reduxDispatch(updateTxn(txn)),
        })
      } catch (e) {
        console.error(e)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    account,
    debouncedTip,
    storedSettings.gasFee,
    tokenFrom,
    tokenNetwork,
    tokenTo,
    activeToken,
    tokenPriceUSD,
    isMounted,
    library,
    activeTradeType,
  ])

  useEffect(() => {
    setDeltaShown(false)
  }, [storedSettings.gasFee])

  const onSlippageUpdate = async (value: number) => {
    setDeltaShown(false)
    setErrorMsg('')

    if (tokenHasFees) {
      settingChangeHandler({ slippageWithFees: value })
    } else {
      const slippageWithFees = storedSettings.slippageWithFees
        ? storedSettings.slippageWithFees
        : value + SLIPPAGE_TAX_WHEN_FEES
      settingChangeHandler({ slippage: value, slippageWithFees })
    }
  }

  const onGasPriceUpdate = async ({ gasFee }: { gasFee: BigNumber }) => {
    settingChangeHandler({ gasFee })
  }

  // TODO: need to refactoring useEffects
  useEffect(() => {
    const amount = fromAmountSelectedCurrency.toNumber()
    const toAmount = toAmountSelectedCurrency.toNumber()

    if (toAmountSelectedCurrency) {
      const currentDelta = (100 * toAmount - amount) / amount

      setDelta(currentDelta)
    }
  }, [fromAmountSelectedCurrency, toAmountSelectedCurrency])

  const fromAmount = quoteResponse
    ? new BigNumber(quoteResponse?.sellAmount).div(10 ** (tokenFrom?.decimals || 0))
    : null

  if (gasPrice === null || !isMounted) {
    return null
  }

  const getRightSlippage = () => {
    return tokenHasFees
      ? storedSettings.slippageWithFees || SLIPPAGE_TAX_WHEN_FEES + storedSettings.slippage
      : storedSettings.slippage
  }

  return (
    <div className="modal-verify modal">
      <div className="close-modal" onClick={closeVerify}>
        <IconClose />
      </div>
      {txn && txn.isLoading && chainId === 56 ? (
        <Spinner
          text={txn.text}
          onClose={closeVerify}
          hashTransaction={hashTransaction}
          network={tokenFrom?.network}
        />
      ) : (
        <React.Fragment>
          <div className="title-modal">Please verify your token swap!</div>
          <div className="modal-verify-body">
            <SwapSummary
              tokenFrom={tokenFrom}
              tokenTo={tokenTo}
              activeToken={activeToken}
              fromAmount={fromAmount}
              fromAmountSelectedCurrency={fromAmountSelectedCurrency}
              previousFromAmountCurrency={previousFromAmountCurrency}
              toAmount={toAmount}
              previousToAmount={previousToAmount}
              toAmountSelectedCurrency={new BigNumber(toAmountSelectedCurrency)}
              previousToAmountCurrency={previousToAmountCurrency}
              delta={delta}
              tokenNetwork={tokenNetwork}
            />
            {isEnoughEthForGas ? (
              <React.Fragment>
                <div className="body-action">
                  {delta <= -10 && (
                    <div className="body-action-row alert">
                      <div className="bg-gradient">
                        <Angry />
                        <p>
                          More than 10% of dollar value drop for your trade due to low liquidity.
                        </p>
                      </div>
                    </div>
                  )}
                  <LimitsOptionsDesktop
                    onSlippageUpdate={onSlippageUpdate}
                    slippage={String(getRightSlippage())}
                    isDeltaShown={isDeltaShown}
                    hasFees={tokenHasFees}
                  />
                  <TipOptionsDesktop onChange={setTip} />
                  <GasFeeOptionsDesktop
                    activeGas={storedSettings.gasFee}
                    gasPrice={gasPrice}
                    onGasPriceUpdate={onGasPriceUpdate}
                  />
                  <NetworkFeeDesktop
                    activeToken={activeToken}
                    gasCosts={gasCosts}
                    previousGasCosts={previousGasCosts}
                    fromAmountSelectedCurrency={fromAmountSelectedCurrency}
                  />
                  <div className="body-action-row justify-center">
                    <span className="error-msg-container">
                      {errorMsg && <ErrorNotification errorMessage={errorMsg} />}
                      {tokenHasFees && !errorMsg && (
                        <ErrorNotification errorMessage={slippageAdjustedMessage} />
                      )}
                    </span>
                  </div>
                </div>
              </React.Fragment>
            ) : (
              <React.Fragment>
                <div className="approve-wrapper">
                  <div className="approve-text">
                    Insufficient {tokenNetwork.toUpperCase()} balance for gas
                  </div>
                </div>
                <div className="body-action">
                  <GasFeeOptionsDesktop
                    activeGas={storedSettings.gasFee}
                    gasPrice={gasPrice}
                    onGasPriceUpdate={onGasPriceUpdate}
                  />
                  <div className="body-action-row">
                    <div className="column">
                      <div className="tooltips">
                        <span className="label">
                          {activeToken.network === 'eth'
                            ? 'Ethereum Network Fee:'
                            : 'BSC Network Fee'}
                        </span>

                        <span
                          className="wrapper-svg"
                          data-for="gas-cost-tooltip"
                          data-tip="The price of Gas you set above reflects on how fast your transaction is being mined on Ethereum Network and how much it cost in ETH.">
                          <IconToolTips />
                        </span>
                        <ReactTooltip
                          id="gas-cost-tooltip"
                          className="custom-tooltip"
                          effect="solid"
                        />
                      </div>
                    </div>
                    <div className="column result-cost">
                      <GasStation />
                    </div>
                  </div>
                </div>
              </React.Fragment>
            )}
          </div>
          <div className="modal-verify-footer">
            {!isEnoughEthForGas ? (
              <button
                disabled={true}
                className="button button-green disable nogas"
                onClick={() =>
                  transactionService.verify({
                    account,
                    activeToken,
                    txn,
                    quoteToken,
                    fromAmountSelectedCurrency,
                    library,
                    chainId,
                    updateTxn: (txn: TxnUpdate) => reduxDispatch(updateTxn(txn)),
                    txnParams: txn.txnParams,
                    type: activeTradeType,
                    tip: debouncedTip,
                  })
                }>
                Insufficient {tokenNetwork.toUpperCase()} balance
              </button>
            ) : (
              <button
                disabled={gasCosts.lte(0)}
                className={`button button-green ${gasCosts.gt(0) ? '' : 'disable'}`}
                onClick={() => {
                  reduxDispatch(changeVerificationComplete({ key: activeTradeType, status: false }))
                  transactionService.tagAndVerify({
                    chainId,
                    account,
                    activeToken,
                    txn,
                    quoteToken,
                    fromAmountSelectedCurrency,
                    library,
                    updateTxn: (txn: TxnUpdate) => reduxDispatch(updateTxn(txn)),
                    txnParams: txn.txnParams,
                    type: activeTradeType,
                    tip: debouncedTip,
                  })
                  closeVerify()
                }}>
                Verify
              </button>
            )}
            <button className="button button-secondary" onClick={closeVerify}>
              Close
            </button>
          </div>
        </React.Fragment>
      )}
    </div>
  )
}

export default ModalVerify
