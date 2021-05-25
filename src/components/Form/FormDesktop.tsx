import React, { useState, useEffect, useRef, MutableRefObject, ChangeEvent } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useWeb3React } from '@web3-react/core'
import { usePrevious } from '../../hooks'
import { financialFormat, getNetworkByChainId } from '../../utils'
import { BigNumber } from 'bignumber.js'
import accounting from 'accounting'
import { useDebounce } from 'use-debounce'
import {
  QUOTE_AUTOREFRESH_INTERVAL,
  QUOTE_REFRESHABLE_INTERVAL,
  RESET_TXN_DELAY,
} from '../../config/settings'
import { getUserBalance } from '../../services/accountService'
import { BALANCE_MAX_DELAY, BALANCE_DELAY } from '../../config/settings'
import FormButtonDesktop from '../buttons/FormButtonDesktop'
import {
  GasPrice,
  QuoteResponse,
  Token,
  TokenIcon,
  TokenNetwork,
  TradeType,
  Transaction,
} from '../../index'

import { updateTxn, updateQuoteToken, updateCurrentToken } from '../../actions'

import * as transactionService from '../../services/transactionService'
import { State } from '../../reducers'
import FormFrom from './FormFrom'
import FormTo from './FormTo'
import FormRates from './FormRates'
import { TxnUpdate } from '../../reducers/txn'
import { QuoteTokenState } from '../../reducers/quoteToken'
import { CurrentTokenState } from '../../reducers/currentToken'
import { getGasPriceByKey } from '../../helpers/verifyHelpers'

const DEFAULT_DECIMALS = 0

interface FormDesktopProps {
  tradeType: TradeType
  openProviderMenu: () => void
  openVerify: (tokenFrom: Token, tokenTo: Token, tradeType: TradeType) => void
}

export function FormDesktop(props: FormDesktopProps) {
  const { library, chainId, account } = useWeb3React()
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

  const [isTokenApproved, setIsTokenApproved] = useState(false)
  const [selectedGasPrice, setSelectedGasPrice] = useState<GasPrice | undefined>()

  const txn: Transaction = useSelector((state: State) => state.txn[props.tradeType])

  const reduxDispatch = useDispatch()

  const { isTokenApproved: tokenApproved = true, approvalComplete } = useSelector((state: State) =>
    props.tradeType === 'Buy' ? state.quoteToken : state.currentToken
  )

  const update = (value: Partial<QuoteTokenState> | Partial<CurrentTokenState>) => {
    if (props.tradeType === 'Buy') {
      reduxDispatch(updateQuoteToken(value))
    } else {
      reduxDispatch(updateCurrentToken(value))
    }
  }

  const {
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
    setQuoteResponse(storedQuoteResponse)
  }, [storedQuoteResponse])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const onApprovalComplete = async () => {
    if (tokenFrom && tokenTo) {
      props.openVerify(tokenFrom, tokenTo, props.tradeType)
    }
  }

  useEffect(() => {
    if (approvalComplete && tokenApproved) {
      onApprovalComplete()
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

  useEffect(() => {
    setWalletNetwork(getNetworkByChainId(chainId))
  }, [chainId])

  useEffect(() => {
    updateUserBalance()
  }, [walletNetwork])

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
    if (!tokenFrom?.id || !tokenTo?.id || !library) {
      setUserBalance(new BigNumber(0))
      return
    }

    getRatioEstimate(new BigNumber(1))
    setErrorMsg(undefined)

    if (tokenFrom?.network !== walletNetwork || tokenTo?.network !== walletNetwork) {
      setUserBalance(new BigNumber(0))
      return
    }

    if (account) {
      transactionService.checkTokenAllowance({
        account,
        tokenNetwork,
        tokenFrom,
        library,
        update,
      })
    }

    transactionService.getGasPrice({
      tokenNetwork,
      updateTxn: (txn: TxnUpdate) => reduxDispatch(updateTxn(txn)),
      type: props.tradeType,
    })

    refreshQuote()
    updateUserBalance()
  }, [tokenFrom?.id, tokenTo?.id])

  useEffect(() => {
    getTokenIcons()
  }, [tokenFrom?.icon, tokenTo?.icon])

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

    return await refreshSimpleQuote(value)
  }

  const getSimpleQuote = async (value?: BigNumber) => {
    if (tokenFrom?.network !== tokenTo?.network) return

    const sellAmount = new BigNumber(Number(value !== undefined ? value : fromInputValue)).times(
      10 ** (tokenFrom?.decimals || DEFAULT_DECIMALS)
    )

    if (tokenFrom && tokenTo && account) {
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

    if (!selectedGasPrice || !tokenTo || !tokenFrom) {
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

  const onSwapClick = async (e: React.ChangeEvent) => {
    if (!account || !library) {
      props.openProviderMenu()
      return
    }

    if (!quoteResponse || fromInputValue === '0') {
      focusFromInput(e)
      return
    }

    if (!new BigNumber(fromInputValue).gt(0)) {
      return
    }

    tokenFrom && tokenTo && props.openVerify(tokenFrom, tokenTo, props.tradeType)
  }

  const onPercentButtonClick = (percent: number, value: string) => {
    setErrorMsg(undefined)
    setFromInputValueText(value)
    setFromInputValue(value)
    fromInputValueDebounced(value)

    setIsEmpty(Number(userBalance.times(percent).toFixed()) <= 0)
    setIsDisabled(false)
  }

  return (
    <div>
      <div className="form">
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
          isMobile={false}
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
        <div className="form-row align-center" />
        <div className="form-row">
          <FormButtonDesktop
            errorMsg={errorMsg}
            type={props.tradeType}
            disabled={isDisabled || isLoading}
            onSwapClick={onSwapClick}
            onApproveClick={onApproveClick}
            tokenTo={tokenTo}
            tokenFrom={tokenFrom}
            isTokenApproved={isTokenApproved}
            quoteNeeded={quoteNeeded}
            isLoading={txn?.isLoading && props.tradeType === txn?.type}
            isInputEmpty={isEmpty || false}
            onRefreshQuote={refreshQuote}
            accountConnected={!!account}
          />
        </div>
      </div>
    </div>
  )
}

export default FormDesktop
