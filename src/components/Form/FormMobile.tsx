import React, { useState, useEffect, useRef, MutableRefObject, ChangeEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import { usePrevious } from '../../hooks'
import { replaceWrapperTokenToToken, financialFormat, getNetworkByChainId } from '../../utils'
import { BigNumber } from 'bignumber.js'
import accounting from 'accounting';
import { useDebounce } from 'use-debounce'
import IconClose from '../../images/icons/close.svg'
import {
  DEFAULT_SLIPPAGE,
  DEFAULT_TIP,
  QUOTE_AUTOREFRESH_INTERVAL,
  QUOTE_REFRESHABLE_INTERVAL,
  SLIPPAGE_TAX_WHEN_FEES,
  RESET_TXN_DELAY,
} from '../../config/settings'
import { getUserBalance } from '../../services/accountService'
import NetworkFeeMobile from '../NetworkFee/NetworkFeeMobile'
import TipOptionsMobile from '../TipOptions/TipOptionsMobile'
import ErrorNotification from '../ErrorNotification'
import Spinner from '../Spinner'
import Modal from 'react-modal'
import { UPDATE_TIP_DELAY, BALANCE_MAX_DELAY, BALANCE_DELAY } from '../../config/settings'
import FormButtonMobile from '../buttons/FormButtonMobile'
import {
  GasPrice,
  QuoteResponse,
  Token,
  TokenIcon,
  TokenNetwork,
  TradeType,
  Transaction,
} from '../../index'
import { doesTokenHaveFees } from '../../services/tokenService'
import { slippageAdjustedMessage, liquidityDropMessage } from '../LimitsOptions/resources'
import { calculateTokenUsdPrices } from '../../services/tokenService'

import * as transactionService from '../../services/transactionService'
import { State } from '../../reducers'
import FormFrom from './FormFrom'
import FormTo from './FormTo'
import FormRates from './FormRates'
import { updateCurrentToken, updateQuoteToken, updateTxn } from '../../actions'
import { QuoteTokenState } from '../../reducers/quoteToken'
import { CurrentTokenState } from '../../reducers/currentToken'
import { TxnUpdate } from '../../reducers/txn'
import { getGasPriceByKey } from '../../helpers/verifyHelpers'

const DEFAULT_DECIMALS = 0

interface FormProps {
  tradeType: TradeType
  openProviderMenu: () => void
  onClose: () => void
}

export function FormMobile(props: FormProps) {
  const { library, chainId, account } = useWeb3React<any>()
  const [walletNetwork, setWalletNetwork] = useState<TokenNetwork | undefined>(
    getNetworkByChainId(chainId)
  )
  const { currentToken: activeToken, quoteToken } = useSelector((state: State) => state)

  const tokenNetwork = activeToken.network

  const [tokenFrom, setTokenFrom] = useState<Token>()
  const [tokenTo, setTokenTo] = useState<Token>()

  const [IconTokenFrom, setIconTokenFrom] = useState<TokenIcon>(null)
  const [IconTokenTo, setIconTokenTo] = useState<TokenIcon>(null)
  const [estimatedTo, setEstimatedTo] = useState<BigNumber>(new BigNumber(0))

  const [quoteResponse, setQuoteResponse] = useState<QuoteResponse | undefined>()
  const [userBalance, setUserBalance] = useState<BigNumber>(new BigNumber(0))

  const [fromInputValue, setFromInputValue] = useState<string>('0')
  const [fromInputValueText, setFromInputValueText] = useState<string>('')

  const [isLoading, setLoading] = useState(false)
  const [isEmpty, setIsEmpty] = useState(true)

  const [isDisabled, setIsDisabled] = useState(false)

  const [errorMsg, setErrorMsg] = useState<string | undefined>(undefined)

  const [ratioUsdPrice, setRatioUsdPrice] = useState(new BigNumber(0))
  const [onFocusInput, setFocusInput] = useState(false)

  const [sources, setSources] = useState('')

  const [quoteNeeded, setQuoteNeeded] = useState(false)

  const [debouncedText] = useDebounce(fromInputValue, 500)
  const prevActiveToken: Token | undefined = usePrevious(activeToken)

  const storedSettings = useSelector((store: State) => store.settings)
  const tokenPriceUSD = useSelector((state: State) => state.tokenPriceUSD)
  const [gasCosts, setGasCosts] = useState(new BigNumber(0))
  const [tip, setTip] = useState<number>(DEFAULT_TIP)
  const [isEnoughEthForGas, setIsEnoughEthForGas] = useState(false)

  const [slippage, setSlippage] = useState(DEFAULT_SLIPPAGE)
  const [debouncedTip] = useDebounce(tip, UPDATE_TIP_DELAY)

  const [isTokenApproved, setIsTokenApproved] = useState(false)
  const [selectedGasPrice, setSelectedGasPrice] = useState<GasPrice | undefined>()

  const [hashTransaction, setHashTransaction] = useState<string | undefined>('')
  const txn: Transaction = useSelector((state: State) => state.txn[props.tradeType])
  const [fromAmountSelectedCurrency, setFromAmountSelectedCurrency] = useState<BigNumber>(
    new BigNumber(0)
  )
  const [fromTokenUsdPrice, setFromTokenUsdPrice] = useState(new BigNumber(0))
  const [toTokenUsdPrice, setToTokenUsdPrice] = useState(new BigNumber(0))

  const [isSpinnerHidden, setSpinnerHidden] = useState(false)
  const [tokenHasFees, setTokenHasFees] = useState(false)
  const [delta, setDelta] = useState(new BigNumber(0))
  const [toAmount, setToAmount] = useState(new BigNumber(0))

  const reduxDispatch = useDispatch()

  const update = (value: Partial<QuoteTokenState> | Partial<CurrentTokenState>) => {
    if (props.tradeType === 'Buy') {
      reduxDispatch(updateQuoteToken(value))
    } else {
      reduxDispatch(updateCurrentToken(value))
    }
  }

  const { isTokenApproved: tokenApproved = true, approvalComplete } = useSelector((state: State) =>
    props.tradeType === 'Buy' ? state.quoteToken : state.currentToken
  )

  const {
    hashTxn,
    quoteResponse: storedQuoteResponse,
    txnVerificationComplete,
    txnVerificationSuccess,
    sourcesString,
    gasPrice,
  } = useSelector((state: State) => state.txn[props.tradeType])

  useEffect(() => {
    setSelectedGasPrice(gasPrice)
  }, [gasPrice])

  useEffect(() => {
    setSources(sourcesString)
  }, [sourcesString])

  useEffect(() => {
    setHashTransaction(hashTxn)
  }, [hashTxn])

  useEffect(() => {
    setQuoteResponse(storedQuoteResponse)
  }, [storedQuoteResponse])

  useEffect(() => {
    if (approvalComplete && tokenApproved) {
      update({ approvalComplete: false })
    }

    setIsTokenApproved(tokenApproved)
    // eslint-disable-next-line @typescript-eslint/no-use-before-define
  }, [tokenApproved, approvalComplete])

  // <\ verificationService refactoring>

  const balanceTimer: MutableRefObject<number | undefined> = useRef()
  const resetTxn: MutableRefObject<number | undefined> = useRef()

  useEffect(() => {
    if (txnVerificationComplete) {
      if (txnVerificationSuccess) {
        fromInputValueDebounced('')
        let counter = BALANCE_DELAY
        // @ts-ignore TODO remove when moving service to TS
        balanceTimer.current = setInterval(() => {
          counter = counter + BALANCE_DELAY
          updateUserBalance()
          if (counter > BALANCE_MAX_DELAY) {
            clearInterval(balanceTimer.current)
          }
        }, BALANCE_DELAY)
        updateUserBalance()
        resetTxn.current = window.setTimeout(() => {
          transactionService.clearTransaction({
            updateTxn: (txn: TxnUpdate) => reduxDispatch(updateTxn(txn)),
            type: props.tradeType,
          })
        }, RESET_TXN_DELAY)
      }
    }
    return () => {
      clearTimeout(resetTxn.current)
      clearInterval(balanceTimer.current)
    }
  }, [txnVerificationComplete])

  // Logic below was moved from MovalVerify to show 10% drop message
  useEffect(() => {
    const newToAmountSelectedCurrency = toAmount.times(toTokenUsdPrice)

    const amount = fromAmountSelectedCurrency.toNumber()
    const currentDelta = (100 * (newToAmountSelectedCurrency.toNumber() - amount)) / amount
    setDelta(new BigNumber(currentDelta))
  }, [toTokenUsdPrice, toAmount])

  useEffect(() => {
    if (quoteResponse?.buyAmount) {
      const newToAmount = new BigNumber(quoteResponse.buyAmount).div(
        10 ** (tokenTo?.decimals || DEFAULT_DECIMALS)
      )
      setToAmount(newToAmount)
    }
  }, [quoteResponse?.buyAmount, tokenTo])

  // end of 10% drop

  useEffect(() => {
    if (selectedGasPrice === null) {
      return
    }

    const fromAmount = quoteResponse
      ? new BigNumber(quoteResponse.sellAmount).div(10 ** (tokenFrom?.decimals || DEFAULT_DECIMALS))
      : null

    const estimatedGasAmount = new BigNumber(quoteResponse?.gas || 0)

    if (!tokenPriceUSD || !tokenFrom?.id || !account || !fromAmount || !selectedGasPrice) {
      return
    }

    const calculateGasCosts = async () => {
      try {
        const { isEnoughEthForGas = true, gasCosts } = await transactionService.calculateGasCosts({
          estimatedGasAmount,
          selectedGasPrice: getGasPriceByKey(selectedGasPrice, storedSettings.gasFee),
          account,
          fromAmount,
          tokenFrom,
          activeToken,
          tokenPriceUSD,
          tokenNetwork,
          library,
        })

        setGasCosts(gasCosts || new BigNumber(0))
        setIsEnoughEthForGas(isEnoughEthForGas)
      } catch (error) {
        console.log(error)
      }
    }

    if (account && library) {
      calculateGasCosts()
    }
  }, [quoteResponse, selectedGasPrice, library, account, isTokenApproved])

  useEffect(() => {
    setWalletNetwork(getNetworkByChainId(chainId))
  }, [chainId])

  useEffect(() => {
    const tokenFromChanged = props.tradeType === 'Buy' ? quoteToken : activeToken
    setTokenFrom(tokenFromChanged)
    setTokenTo(props.tradeType === 'Buy' ? activeToken : quoteToken)

    setSources('')
    setQuoteNeeded(false)
    getRatioEstimate(new BigNumber(1))
  }, [activeToken?.id, quoteToken?.id, account, walletNetwork])

  useEffect(() => {
    if (!activeToken || !prevActiveToken || activeToken.id === prevActiveToken?.id) {
      return
    }

    setFromInputValue('0')
    setEstimatedTo(new BigNumber(0))
    setIsEmpty(true)
  }, [activeToken?.id])

  useEffect(() => {
    const calculateFees = async () => {
      const doesIt: boolean = await doesTokenHaveFees(tokenFrom, tokenTo)
      setTokenHasFees(doesIt)

      if (doesIt) {
        const newSlippage: number =
          // Condition to avoid recursive update when global state is updated
          slippage < SLIPPAGE_TAX_WHEN_FEES ? slippage * SLIPPAGE_TAX_WHEN_FEES : slippage
        setSlippage(newSlippage)
      }
    }

    calculateFees()
  }, [tokenFrom, tokenTo])

  useEffect(() => {
    if (!tokenFrom?.id || !tokenTo?.id || !library || !account) {
      setUserBalance(new BigNumber(0))
      return
    }

    getRatioEstimate(new BigNumber(1))
    setErrorMsg(undefined)

    if (tokenFrom?.network !== walletNetwork || tokenTo?.network !== walletNetwork) {
      setUserBalance(new BigNumber(0))
      return
    }
    transactionService.checkTokenAllowance({
      account,
      tokenNetwork,
      tokenFrom,
      library,
      update,
    })

    transactionService.getGasPrice({
      tokenNetwork,
      updateTxn: (txn: TxnUpdate) => reduxDispatch(updateTxn(txn)),
      type: props.tradeType,
    })

    const { fromTokenUsdPrice, toTokenUsdPrice } = calculateTokenUsdPrices({
      tokenFrom,
      tokenTo,
    })

    setFromTokenUsdPrice(fromTokenUsdPrice || 0)
    setToTokenUsdPrice(toTokenUsdPrice || 0)

    refreshQuote()

    updateUserBalance()
  }, [tokenFrom?.id, tokenTo?.id])

  useEffect(() => {
    getTokenIcons()
  }, [tokenFrom?.icon, tokenTo?.icon])

  useEffect(() => {
    updateUserBalance()
  }, [chainId])

  useEffect(() => {
    if (!tokenFrom) {
      return
    }

    if (props.tradeType === 'Buy') {
      setFromInputValue('0')
      setEstimatedTo(new BigNumber(0))
      setIsEmpty(true)
    }
  }, [tokenFrom?.id])

  useEffect(() => {
    if (!tokenTo) {
      return
    }

    if (props.tradeType !== 'Buy') {
      refreshQuote()
    }
  }, [tokenTo?.id])

  useEffect(() => {
    if (quoteResponse) {
      const interval = setInterval(() => {
        if (fromInputValue && fromInputValue !== '0') {
          setQuoteNeeded(true)
        }
      }, QUOTE_REFRESHABLE_INTERVAL)
      return () => clearInterval(interval)
    }
  }, [quoteResponse])

  useEffect(() => {
    if (quoteResponse && quoteNeeded) {
      const interval = setInterval(async () => {
        if (fromInputValue && fromInputValue !== '0' && tokenTo?.id) {
          refreshQuote()
        }
      }, QUOTE_AUTOREFRESH_INTERVAL)
      return () => clearInterval(interval)
    }
  }, [quoteResponse, quoteNeeded])

  useEffect(() => {
    fromInputValueDebounced(debouncedText)
  }, [debouncedText])

  useEffect(() => {
    setQuoteResponse(undefined)
  }, [fromInputValue])

  useEffect(() => {
    const fromAmountSelectedCurrencyVar = new BigNumber(fromInputValue).times(
      fromTokenUsdPrice || new BigNumber(0)
    )
    setFromAmountSelectedCurrency(fromAmountSelectedCurrencyVar)
  }, [fromTokenUsdPrice, fromInputValue])

  useEffect(() => {
    initializeErrorMsg()
  }, [userBalance, fromInputValue, walletNetwork, tokenFrom?.id, tokenTo?.id])

  useEffect(() => {
    if (txn?.balanceHasChanged === true) {
      updateUserBalance()
    }
  }, [txn?.balanceHasChanged])

  const initializeErrorMsg = () => {
    if (account) {
      if (tokenNetwork !== walletNetwork) {
        setIsDisabled(true)
        setErrorMsg('Wrong Network')
      } else if (new BigNumber(fromInputValue).gt(userBalance)) {
        setIsDisabled(true)
        setErrorMsg('Insufficient balance')
      } else {
        setIsDisabled(false)
        setErrorMsg(undefined)
      }
    }
  }

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const updateUserBalance = async () => {
    if (!tokenFrom?.id) {
      return
    }

    const balance = await getUserBalance({
      library,
      account,
      tokenNetwork,
      walletNetwork,
      tokenFrom,
    })

    if (!userBalance.eq(balance)) {
      clearInterval(balanceTimer.current)
    }
    setUserBalance(balance)
  }

  const getTokenIcons = async () => {
    if (tokenFrom?.icon) {
      const fromTokenIcon = tokenFrom?.icon
      setIconTokenFrom(fromTokenIcon)
    }
    if (tokenTo?.icon) {
      const toTokenIcon = tokenTo?.icon
      setIconTokenTo(toTokenIcon)
    }
  }

  const onFromInputChange = async (event: ChangeEvent<HTMLInputElement>) => {
    setLoading(true)
    const hasValue =
      event.target.value !== null && event.target.value !== undefined && event.target.value !== ''
    const value = !hasValue ? '0' : event.target.value
    setIsEmpty(!hasValue)
    setFromInputValueText('')
    setFromInputValue(value.replace(/,/g, ''))
  }

  const refreshQuote = async (value?: BigNumber) => {
    if (!(value instanceof BigNumber)) {
      value = undefined
    }

    if (isTokenApproved && !txn.isLoading) {
      return await refreshQuoteWithGas(value)
    } else {
      return await refreshSimpleQuote(value)
    }
  }

  const getSimpleQuote = async (value?: BigNumber) => {
    if (tokenFrom?.network !== tokenTo?.network) return

    const sellAmount = new BigNumber(Number(value !== undefined ? value : fromInputValue)).times(
      10 ** (tokenFrom?.decimals || DEFAULT_DECIMALS)
    )

    if (!tokenFrom || !tokenTo) {
      return
    }

    return transactionService
      .getSimpleSwapEstimate({
        sellAmount,
        tokenNetwork,
        tokenFrom,
        tokenTo,
        type: props.tradeType,
        updateTxn: (txn: TxnUpdate) => reduxDispatch(updateTxn(txn)),
      })
      .catch((error) => {
        console.log(error)
        setQuoteNeeded(false)
        setLoading(false)
      })
  }

  const refreshSimpleQuote = async (value?: BigNumber) => {
    console.debug('Refreshing quote for desktop')
    setLoading(true)
    const estimatedAmount = await getSimpleQuote(value)

    setLoading(false)
    setQuoteNeeded(false)

    if (estimatedAmount) {
      setEstimatedTo(estimatedAmount)
    }

    return estimatedAmount
  }

  const refreshQuoteWithGas = async (value?: BigNumber) => {
    console.log('Refreshing quote for mobile')

    let estimatedSwapAmount

    if (!account || !tokenFrom) {
      return
    }

    setLoading(true)

    await transactionService.getGasPrice({
      tokenNetwork,
      updateTxn: (txn: TxnUpdate) => reduxDispatch(updateTxn(txn)),
      type: props.tradeType,
    })

    if (!tokenTo || !selectedGasPrice) {
      return
    }

    try {
      setErrorMsg('')
      const sellAmount = new BigNumber(Number(value !== undefined ? value : fromInputValue)).times(
        10 ** (tokenFrom?.decimals || DEFAULT_DECIMALS)
      )
      estimatedSwapAmount = await transactionService.getSwapEstimate({
        slippage,
        tokenFrom,
        tokenTo,
        account,
        tokenNetwork,
        selectedGasPrice: getGasPriceByKey(selectedGasPrice, storedSettings.gasFee),
        debouncedTip,
        sellAmount,
        type: props.tradeType,
        updateTxn: (txn: TxnUpdate) => reduxDispatch(updateTxn(txn)),
        onClose: props.onClose,
      })

      if (estimatedSwapAmount) {
        setEstimatedTo(estimatedSwapAmount)
      }
    } catch (error) {
      setErrorMsg(error.message)
    }

    setQuoteNeeded(false)
    setLoading(false)
    return estimatedSwapAmount
  }

  const onFocus = () => {
    setFocusInput(true)
  }

  const onBlur = () => {
    setFocusInput(false)
  }

  const fromInputValueDebounced = async (debouncedFromInput: string) => {
    setLoading(true)
    const unformattedValue = accounting.unformat(debouncedFromInput)

    if (debouncedFromInput.substr(debouncedFromInput.length - 1) === '.') {
      return
    }
    setIsEmpty(unformattedValue === 0)
    setFromInputValueText(financialFormat(unformattedValue))
    const valueBN = new BigNumber(accounting.unformat(`${unformattedValue}`))
    await refreshQuote(valueBN)
  }

  const getRatioEstimate = async (sellAmount: BigNumber) => {
    const estimatedAmount = await getSimpleQuote(sellAmount)
    if (!estimatedAmount) {
      return null
    }
    setRatioUsdPrice(estimatedAmount)
  }

  const focusFromInput = (e: React.ChangeEvent) => {
    e.target.closest('.form')?.querySelectorAll('input')[0].focus()
    onFocus()
  }

  const onApproveClick = async (e: React.ChangeEvent) => {
    if (!account || !library) {
      props.openProviderMenu()
      return
    }

    if (!quoteResponse || fromInputValue === '0') {
      focusFromInput(e)
      return
    }

    if (!tokenFrom || !tokenTo || !selectedGasPrice) {
      return
    }

    await transactionService.approve({
      account,
      selectedGasPrice: getGasPriceByKey(selectedGasPrice, storedSettings.gasFee),
      tokenFrom,
      tokenTo,
      sellAmount: new BigNumber(fromInputValue).times(
        10 ** (tokenFrom?.decimals || DEFAULT_DECIMALS)
      ),
      type: props.tradeType,
      library,
      chainId,
      update,
      updateTxn: (txn: TxnUpdate) => reduxDispatch(updateTxn(txn)),
    })
  }

  const onSlideVerify = () => {
    setSpinnerHidden(false)

    if (!account || !library) {
      props.openProviderMenu()
      return
    }

    if (!quoteResponse || fromInputValue === '0' || !chainId) {
      return
    }

    transactionService.tagAndVerify({
      chainId,
      library,
      account,
      activeToken,
      quoteToken,
      fromAmountSelectedCurrency,
      txnParams: txn.txnParams,
      type: props.tradeType,
      updateTxn: (txn: TxnUpdate) => reduxDispatch(updateTxn(txn)),
      txn,
      tip: debouncedTip,
    })
  }

  const onPercentButtonClick = (percent: number, value: string) => {
    setErrorMsg(undefined)
    setFromInputValueText(value)
    setFromInputValue(value)
    fromInputValueDebounced(value)

    setIsEmpty(Number(userBalance.times(percent).toFixed()) <= 0)
    setIsDisabled(false)
  }

  if (!isSpinnerHidden && txn?.isLoading && chainId === 56) {
    return (
      <Modal
        isOpen={true}
        onRequestClose={props.onClose}
        overlayClassName="overlay-modal"
        className="spinner-modal">
        <Spinner
          text={txn.text}
          onClose={() => {
            setSpinnerHidden(true)
            transactionService.clearTransaction({
              updateTxn: (txn: TxnUpdate) => reduxDispatch(updateTxn(txn)),
              type: props.tradeType,
            })
            props.onClose && props.onClose()
          }}
          hashTransaction={hashTransaction}
          network={tokenFrom?.network}
        />
      </Modal>
    )
  }

  return (
    <div>
      <div className="form mobile">
        <h2 className="form-title mobile">{composeTitle(props.tradeType, tokenTo, tokenFrom)}</h2>
        <div className="close-modal light" onClick={props.onClose}>
          <IconClose />
        </div>
        <FormFrom
          IconTokenFrom={IconTokenFrom}
          IconTokenTo={IconTokenTo}
          account={account}
          debouncedText={debouncedText}
          fromInputValue={fromInputValue}
          fromInputValueText={fromInputValueText}
          isEmpty={isEmpty}
          onBlur={onBlur}
          onFocus={onFocus}
          onFocusInput={onFocusInput}
          onFromInputChange={onFromInputChange}
          onPercentUpdate={onPercentButtonClick}
          setTokenFrom={setTokenFrom}
          setTokenTo={setTokenTo}
          tokenFrom={tokenFrom}
          tokenNetwork={tokenNetwork}
          tokenTo={tokenTo}
          tradeType={props.tradeType}
          userBalance={userBalance}
          walletNetwork={walletNetwork}
          openProviderMenu={props.openProviderMenu}
        />
        <FormTo
          IconTokenFrom={IconTokenFrom}
          estimatedTo={estimatedTo}
          IconTokenTo={IconTokenTo}
          isEmpty={isEmpty}
          isLoading={isLoading}
          isMobile={true}
          onFocusInput={onFocusInput}
          setTokenFrom={setTokenFrom}
          setTokenTo={setTokenTo}
          tokenFrom={tokenFrom}
          tokenTo={tokenTo}
          tradeType={props.tradeType}
        />
        <FormRates
          isEmpty={isEmpty}
          ratioUsdPrice={ratioUsdPrice}
          sources={sources}
          tokenFrom={tokenFrom}
          tokenTo={tokenTo}
        />
        {isTokenApproved && (
          <>
            <div className="form-row">
              <NetworkFeeMobile
                fromAmountSelectedCurrency={fromAmountSelectedCurrency}
                gasCosts={gasCosts}
                isEnoughEthForGas={isEnoughEthForGas}
                isTokenApproved={isTokenApproved}
                activeToken={activeToken}
              />
            </div>
            <div className="form-row">
              <TipOptionsMobile onChange={setTip} />
            </div>
          </>
        )}
        <div className="form-row align-center">
          {errorMsg && <ErrorNotification errorMessage={errorMsg} />}
          {delta.lte(-10) && <ErrorNotification errorMessage={liquidityDropMessage} />}
          {tokenHasFees && !errorMsg && (
            <ErrorNotification errorMessage={slippageAdjustedMessage} />
          )}
        </div>
        <div className="form-row">
          {!txn.isLoading && (
            <FormButtonMobile
              type={props.tradeType}
              isTokenApproved={isTokenApproved}
              quoteNeeded={quoteNeeded}
              disabled={isDisabled || isLoading || !library}
              onVerify={onSlideVerify}
              onApprove={onApproveClick}
              onRefreshQuote={refreshQuote}
            />
          )}
        </div>
      </div>
    </div>
  )
}

const composeTitle = (tradeType: TradeType, tokenTo?: Token, tokenFrom?: Token) => {
  const token =
    tradeType.toLowerCase() === 'buy'
      ? replaceWrapperTokenToToken(tokenTo?.symbol)
      : replaceWrapperTokenToToken(tokenFrom?.symbol)

  return `${tradeType} ${token}`
}

export default FormMobile
