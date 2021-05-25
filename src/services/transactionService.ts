import Notify from 'bnc-notify'
import qs from 'query-string'
import { BigNumber } from 'bignumber.js'
import { calculateGasPrices } from '../helpers/verifyHelpers'
import { ZERO_X_ETH_ADDRESS, ZERO_X_SPENDER_ADDRESS } from '../config/tokens'
import erc20ABI from '../abi/erc20'
import {
  getTokenAddressFromId,
  getTokenAllowance,
  checkTokensAddressAndNetwork,
  grabErrors,
} from '../utils'
import {
  GTM_PURCHASE_TRESHOLD_TOP,
  referrerAddress,
  zeroXAPIUrls,
  zeroXGasAPIURL,
} from '../config/settings'
import { NETWORK, CHAIN_ID, APPROVAL_CONFIRMED_TIMEOUT, MAX_UINT } from '../constants/constants'
import gtmService from './gtmService'
import {
  GasPrice,
  QuoteResponse,
  Receipt,
  Source,
  Token,
  TokenNetwork,
  TokenPriceUSD,
  TradeType,
  Transaction,
} from '../index'
import { QuoteTokenState } from '../reducers/quoteToken'
import { CurrentTokenState } from '../reducers/currentToken'
import { TxnUpdate } from '../reducers/txn'
import { apiFetch } from '../dexguruFetch'

const notify = Notify({
  dappId: 'af6ea2a8-22d8-4ec7-8b71-bc6eae2564bc',
  networkId: 1,
  mobilePosition: 'top',
})

export const calculateGasCosts = async ({
  estimatedGasAmount,
  selectedGasPrice,
  account,
  fromAmount,
  tokenFrom,
  activeToken,
  tokenPriceUSD,
  tokenNetwork,
  library,
}: {
  estimatedGasAmount: BigNumber
  selectedGasPrice: BigNumber
  account: string
  library: any
  fromAmount?: BigNumber
  tokenFrom: Token
  activeToken: Token
  tokenPriceUSD: TokenPriceUSD
  tokenNetwork: TokenNetwork
}): Promise<{ gasCosts: BigNumber; isEnoughEthForGas: boolean }> => {
  try {
    const gasCostsEth = estimatedGasAmount.times(selectedGasPrice).div(10 ** 18)
    const balance = await library.eth.getBalance(account)

    const ethBalance = new BigNumber(balance).div(10 ** 18)

    const fromAmountEth =
      checkTokensAddressAndNetwork(tokenFrom, tokenNetwork) && fromAmount ? fromAmount : 0

    const isEnoughEthForGas = ethBalance.minus(fromAmountEth).gt(gasCostsEth)

    const gasCosts =
      activeToken.network === NETWORK.eth
        ? gasCostsEth.times(tokenPriceUSD.ethPrice)
        : gasCostsEth.times(tokenPriceUSD.bnbPrice)

    return { gasCosts, isEnoughEthForGas }
  } catch (error) {
    console.error(error)
    throw error
  }
}

export const checkTokenAllowance = async ({
  account,
  tokenNetwork,
  tokenFrom,
  library,
  update,
}: {
  account: string
  tokenNetwork: TokenNetwork
  tokenFrom?: Token
  library: any
  update: (value: Partial<QuoteTokenState> | Partial<CurrentTokenState>) => void
}): Promise<{ isTokenApproved: boolean }> => {
  try {
    update && update({ isTokenApproved: false })

    if (!tokenFrom?.id) {
      throw new Error('no-tokenFrom')
    }

    if (!library) {
      // fatal
      throw new Error('no-library')
    }

    if (checkTokensAddressAndNetwork(tokenFrom, tokenNetwork)) {
      update && update({ isTokenApproved: true })
      return { isTokenApproved: true }
    }

    if (!library?.eth || !account) {
      throw new Error('library, account required')
    }

    const tokenAddress = getTokenAddressFromId(tokenFrom)
    const tokenAllowance = await getTokenAllowance(
      tokenAddress,
      ZERO_X_SPENDER_ADDRESS,
      account,
      library
    )

    const tokenAllowanceBigNumber = new BigNumber(tokenAllowance).gt(0)

    update && update({ isTokenApproved: tokenAllowanceBigNumber })
    return { isTokenApproved: tokenAllowanceBigNumber }
  } catch (error) {
    console.error('***', error)
    update && update({ isTokenApproved: false, error })
    return { isTokenApproved: false }
  }
}

const checkApprovalETH = async ({
  tokenAddress,
  sellAmount,
  account,
  selectedGasPrice,
  type,
  library,
  updateTxn,
  update,
}: {
  tokenAddress: string
  sellAmount: BigNumber
  account: string
  selectedGasPrice: BigNumber
  type: TradeType
  library: any
  updateTxn: (txnUpdate: TxnUpdate) => void
  update: (value: Partial<QuoteTokenState> | Partial<CurrentTokenState>) => void
}): Promise<void> => {
  if (tokenAddress === ZERO_X_ETH_ADDRESS) {
    update({ isTokenApproved: true, approvalComplete: true })
    return
  }

  const erc20Contract = new library.eth.Contract(erc20ABI, tokenAddress)
  const erc20allowance = await erc20Contract.methods
    .allowance(account, ZERO_X_SPENDER_ADDRESS)
    .call()

  if (new BigNumber(sellAmount).gt(erc20allowance)) {
    // start pending
    updateTxn({
      key: type,
      patch: {
        isLoading: true,
        text: 'TX Pending',
        hashTxn: undefined,
        type,
      },
    })
    update({ isTokenApproved: false, approvalComplete: false })

    const stopTxPendingAnimation = () => {
      updateTxn({
        key: type,
        patch: {
          isLoading: false,
          hashTxn: undefined,
          type,
        },
      })
      update({ isTokenApproved: false, approvalComplete: true })
    }

    const approvalConfirmed = (): void => {
      // Propagating original quote response to avoid race conditions
      // The VerifyModal will do a better quote with gas
      setTimeout(() => {
        updateTxn({
          key: type,
          patch: {
            isLoading: false,
            hashTxn: undefined,
            type,
          },
        })
        update({ isTokenApproved: true, approvalComplete: true })
      }, APPROVAL_CONFIRMED_TIMEOUT)
    }

    const gasAmount = await erc20Contract.methods
      .approve(ZERO_X_SPENDER_ADDRESS, `0x${MAX_UINT.toString(16)}`)
      .estimateGas({ from: account })

    await erc20Contract.methods
      .approve(ZERO_X_SPENDER_ADDRESS, `0x${MAX_UINT.toString(16)}`)
      .send({ from: account, gas: gasAmount, gasPrice: selectedGasPrice.toFixed() })
      .on('transactionHash', (hash: string) => {
        const { emitter } = notify.hash(hash)

        emitter.on('all', (transaction) => {
          updateTxn({
            key: type,
            patch: {
              isLoading: true,
              text: 'TX Pending',
              hashTxn: transaction.hash,
              type,
            },
          })

          console.log(transaction)
        })
        emitter.on('txConfirmed', approvalConfirmed)
        emitter.on('txFailed', stopTxPendingAnimation)
      })

      .once('confirmation', () => {
        // this may solved 'approvalConfirmed timeout' problem, need more tests *1
        updateTxn({
          key: type,
          patch: {
            isLoading: false,
            hashTxn: undefined,
            type,
          },
        })
        update({ isTokenApproved: true, approvalComplete: true })
      })

      .catch((e: Error) => {
        console.error(e)
        stopTxPendingAnimation()
      })
    /*.then((result) => {
      })*2*/
  }
}

const checkApprovalBSC = async ({
  tokenAddress,
  account,
  selectedGasPrice,
  sellAmount,
  type,
  library,
  updateTxn,
  update,
}: {
  tokenAddress: string
  account: string
  selectedGasPrice: BigNumber
  sellAmount: BigNumber
  type: TradeType
  library: any
  updateTxn: (txnUpdate: TxnUpdate) => void
  update: (value: Partial<QuoteTokenState> | Partial<CurrentTokenState>) => void
}): Promise<void> => {
  if (tokenAddress === ZERO_X_ETH_ADDRESS) {
    updateTxn({
      key: type,
      patch: {
        isLoading: false,
        text: '',
        hashTxn: undefined,
        type,
      },
    })
    update({ isTokenApproved: true, approvalComplete: true })
    return
  }

  const erc20Contract = new library.eth.Contract(erc20ABI, tokenAddress)
  const erc20allowance = await erc20Contract.methods
    .allowance(account, ZERO_X_SPENDER_ADDRESS)
    .call()

  if (new BigNumber(sellAmount).gt(erc20allowance)) {
    updateTxn({
      key: type,
      patch: {
        isLoading: true,
        text: 'Waiting for token approval',
        hashTxn: undefined,
        type,
      },
    })
    update({ isTokenApproved: false, approvalComplete: false })

    await erc20Contract.methods
      .approve(ZERO_X_SPENDER_ADDRESS, `0x${MAX_UINT.toString(16)}`)
      .send({ from: account, gasPrice: selectedGasPrice.toFixed() })
      .once('transactionHash', (hash: string) => {
        updateTxn({
          key: type,
          patch: { isLoading: false, text: '', hashTxn: hash },
        })
        console.log(hash)
      })
      .once('receipt', function (receipt: Receipt) {
        console.log('receipt', receipt)
      })
      .once('confirmation', (confirmationNumber: number, receipt: Receipt) => {
        console.log('confirmed', confirmationNumber, receipt)
        // Propagating original quote response to avoid race conditions
        // The VerifyModal will do a better quote with gas

        updateTxn({
          key: type,
          patch: { isLoading: false, text: '' },
        })
        update({ isTokenApproved: true, approvalComplete: true })
      })
      .once('error', (err: Error) => {
        updateTxn({
          key: type,
          patch: { isLoading: false, text: err.message, type },
        })
        update({ isTokenApproved: false, approvalComplete: true })
      })
      .catch(() => {
        updateTxn({
          key: type,
          patch: {
            isLoading: false,
            hashTxn: undefined,
            type,
          },
        })
        update({ isTokenApproved: false, approvalComplete: true })
      })
  }
}

// dispatcher
export const approve = async (args: {
  library: any
  account: string
  tokenFrom: Token
  tokenTo: Token
  chainId?: number
  type: TradeType
  updateTxn: (txnUpdate: TxnUpdate) => void
  selectedGasPrice: BigNumber
  sellAmount: BigNumber
  update: (value: Partial<QuoteTokenState> | Partial<CurrentTokenState>) => void
}): Promise<void> => {
  // all args are required
  const hasEmpty = Object.values(args).some((arg) => !arg && arg !== 0)
  // fatal
  if (hasEmpty) {
    console.error('all arguments is required')
    return
  }

  const { library, account, tokenFrom } = args

  if (!library || !account) {
    console.error('no-library')
  }

  const tokenAddress = getTokenAddressFromId(tokenFrom)

  if (args.chainId === CHAIN_ID) {
    return checkApprovalETH({
      ...args,
      tokenAddress,
    })
  }

  return checkApprovalBSC({
    ...args,
    tokenAddress,
  })
}

export const getGasPriceCalculation = async ({
  tokenNetwork,
}: {
  tokenNetwork: string
}): Promise<GasPrice | undefined> => {
  // @ts-ignore
  const gasPriceResponse = await apiFetch(zeroXGasAPIURL[tokenNetwork])

  const gasPriceData = gasPriceResponse.result.find((e: any) => e.source === 'MEDIAN')

  return calculateGasPrices(gasPriceData)
}

export const getGasPrice = async ({
  tokenNetwork,
  updateTxn,
  type,
}: {
  tokenNetwork: TokenNetwork
  updateTxn: (txnUpdate: TxnUpdate) => void
  type: TradeType
}): Promise<void> => {
  try {
    const gasPrice = await getGasPriceCalculation({ tokenNetwork })

    if (gasPrice) {
      updateTxn({
        key: type,
        patch: {
          gasPrice,
        },
      })
      return
    }
  } catch (e) {
    console.error(e)
    return
  }
}

export const verifyETH = async ({
  activeToken,
  quoteToken,
  fromAmountSelectedCurrency,
  type,
  library,
  updateTxn,
  txnParams,
  tip,
}: {
  activeToken: Token
  quoteToken: Token
  txn: Transaction
  fromAmountSelectedCurrency: BigNumber
  type: TradeType
  library: any
  updateTxn: (txnUpdate: TxnUpdate) => void
  txnParams: object
  tip: number
}): Promise<void> => {
  if (!txnParams) {
    return
  }

  let txnHash: string | undefined = undefined
  const onConfirmed = () => {
    updateTxn({
      key: type,
      patch: {
        isLoading: false,
        hashTxn: undefined,
        balanceHasChanged: true,
        type,
        txnVerificationComplete: true,
        txnVerificationSuccess: true,
      },
    })
  }

  const stopTxPendingAnimationWithRefund = () => {
    if (txnHash) {
      // if txnHash is still undefiend that indicates that txn was not sent (i.e. rejected in Metamask)
      gtmService.v3.refund(txnHash)
      gtmService.v4.refund(txnHash)
    }
    updateTxn({
      key: type,
      patch: {
        isLoading: false,
        hashTxn: undefined,
        balanceHasChanged: true,
        type,
        txnVerificationComplete: true,
        txnVerificationSuccess: false,
      },
    })
  }

  updateTxn({
    key: type,
    patch: {
      isLoading: true,
      text: 'TX Pending',
      hashTxn: undefined,
      type,
      txnVerificationComplete: false,
    },
  })

  library.eth
    .sendTransaction(txnParams)
    .on('transactionHash', (hash: string) => {
      const { emitter } = notify.hash(hash)

      emitter.on('all', (transaction) => {
        updateTxn({
          key: type,
          patch: {
            isLoading: true,
            text: 'TX Pending',
            hashTxn: transaction.hash,
            balanceHasChanged: true,
            txnVerificationComplete: false,
            type,
          },
        })
        console.log(transaction)
      })
      txnHash = hash

      if (txnHash && fromAmountSelectedCurrency.lt(new BigNumber(GTM_PURCHASE_TRESHOLD_TOP))) {
        gtmService.v3.purchase(txnHash, tip, fromAmountSelectedCurrency, activeToken, quoteToken)
        gtmService.v4.purchase(txnHash, tip, fromAmountSelectedCurrency, activeToken, quoteToken)
      }
      emitter.on('txConfirmed', onConfirmed)
      emitter.on('txFailed', stopTxPendingAnimationWithRefund)
    })
    .catch((e: Error) => {
      console.error(e)
      txnHash = 'reject in wallet'
      stopTxPendingAnimationWithRefund()
    })
}

export const verifyBSC = async ({
  activeToken,
  quoteToken,
  fromAmountSelectedCurrency,
  type,
  library,
  updateTxn,
  txnParams,
  tip,
}: {
  activeToken: Token
  txn: Transaction
  quoteToken: Token
  fromAmountSelectedCurrency: BigNumber
  type: TradeType
  library: any
  updateTxn: (txnUpdate: TxnUpdate) => void
  txnParams: object
  tip: number
}): Promise<void> => {
  let txnHash: string | undefined = undefined
  updateTxn({
    key: type,
    patch: {
      isLoading: true,
      text: 'Wait while the transaction is being mined',
      type,
      balanceHasChanged: false,
      txnVerificationComplete: false,
      txnVerificationSuccess: true,
    },
  })

  library.eth
    .sendTransaction(txnParams)
    .once('transactionHash', function (hash: string) {
      updateTxn({
        key: type,
        patch: {
          isLoading: true,
          text: 'TX Pending',
          hashTxn: hash,
          balanceHasChanged: true,
          txnVerificationComplete: false,
          type,
        },
      })
      txnHash = hash
      if (fromAmountSelectedCurrency.lt(new BigNumber(GTM_PURCHASE_TRESHOLD_TOP))) {
        gtmService.v3.purchase(txnHash, tip, fromAmountSelectedCurrency, activeToken, quoteToken)
        gtmService.v4.purchase(txnHash, tip, fromAmountSelectedCurrency, activeToken, quoteToken)
      }
      console.log('hash ', hash)
    })
    .once('receipt', function (receipt: Receipt) {
      console.log('receipt ', receipt)
    })
    .once('confirmation', (confirmationNumber: number, receipt: Receipt) => {
      console.log('confirmed ', confirmationNumber, receipt)

      updateTxn({
        key: type,
        patch: {
          isLoading: false,
          balanceHasChanged: true,
          type,
          txnVerificationComplete: true,
          txnVerificationSuccess: true,
        },
      })
    })
    .once('error', (err: Error) => {
      if (txnHash) {
        // if txnHash is still undefiend that indicates that txn was not sent (i.e. rejected in Metamask)
        gtmService.v3.refund(txnHash)
        gtmService.v4.refund(txnHash)
      }
      updateTxn({
        key: type,
        patch: {
          isLoading: false,
          balanceHasChanged: true,
          type,
          text: err.message,
          txnVerificationComplete: true,
          txnVerificationSuccess: false,
        },
      })

      console.error(err)
    })
    .then((receipt: Receipt) => {
      console.log('finished ', { receipt })

      updateTxn({
        key: type,
        patch: {
          isLoading: false,
          balanceHasChanged: true,
          type,
          txnVerificationComplete: true,
        },
      })
    })
    .catch((err: Error) => {
      console.log('error ', { err })
      updateTxn({
        key: type,
        patch: {
          isLoading: false,
          balanceHasChanged: true,
          type,
          text: err.message,
          txnVerificationComplete: true,
          txnVerificationSuccess: false,
        },
      })

      console.error(err)
    }) // If a out of gas error, the second parameter is the receipt.;
}

export const verify = async (args: {
  chainId?: number
  activeToken: Token
  txn: Transaction
  quoteToken: Token
  fromAmountSelectedCurrency: BigNumber
  type: TradeType
  library: any
  updateTxn: (txnUpdate: TxnUpdate) => void
  txnParams: object
  tip: number
  account?: string | null
}): Promise<void> => {
  if (args.chainId === CHAIN_ID) {
    await verifyETH(args)
    return
  }

  await verifyBSC(args)
}

export const tagAndVerify = async (args: {
  chainId: number | undefined
  library: any
  account?: string | null
  activeToken: Token
  quoteToken: Token
  fromAmountSelectedCurrency: BigNumber
  txnParams: object
  txn: Transaction
  type: TradeType
  updateTxn: (txnUpdate: TxnUpdate) => void
  tip: number
}): Promise<void> => {
  const { library, account, activeToken, quoteToken, fromAmountSelectedCurrency, txnParams } = args

  if (!library || !account || !txnParams) {
    return
  }

  // Don't send analytics about shitcoins with etxra high trade volumes
  if (fromAmountSelectedCurrency.lt(new BigNumber(GTM_PURCHASE_TRESHOLD_TOP))) {
    gtmService.v3.beginCheckout(activeToken, quoteToken)
    gtmService.v4.beginCheckout(activeToken, quoteToken)
  }

  return await verify(args)
}

export const getSimpleSwapQuote = async ({
  sellAmount,
  tokenNetwork,
  tokenFrom,
  tokenTo,
  updateTxn,
  type,
}: {
  sellAmount: BigNumber
  tokenNetwork: TokenNetwork
  tokenFrom: Token
  tokenTo: Token
  updateTxn: (txnUpdate: TxnUpdate) => void
  type: TradeType
}): Promise<QuoteResponse | undefined> => {
  if (!sellAmount.gt(0)) {
    return
  }

  if (tokenFrom.id === tokenTo.id) {
    return
  }

  const fromTokenId = checkTokensAddressAndNetwork(tokenFrom, tokenNetwork)
    ? ZERO_X_ETH_ADDRESS
    : getTokenAddressFromId(tokenFrom)
  const toTokenId = checkTokensAddressAndNetwork(tokenTo, tokenNetwork)
    ? ZERO_X_ETH_ADDRESS
    : getTokenAddressFromId(tokenTo)

  const queryString = {
    sellToken: fromTokenId,
    buyToken: toTokenId,
    sellAmount: sellAmount.toFixed(0),
  }

  const zeroXAPIUrl = zeroXAPIUrls[tokenNetwork]
  const url = `${zeroXAPIUrl}/swap/v1/quote?${qs.stringify(queryString)}`
  const quoteResponse = await apiFetch(url, {
    onError: async (response: any) => {
      const responseJson = await response.json()
      const statusText = grabErrors(responseJson)

      throw new Error(statusText)
    },
  })

  if (
    !quoteResponse ||
    (quoteResponse && quoteResponse.message && quoteResponse.message === 'Error')
  ) {
    updateTxn({
      key: type,
      patch: {
        quoteResponse: quoteResponse,
      },
    })
    return
  }

  updateTxn({
    key: type,
    patch: {
      quoteResponse,
    },
  })
  return quoteResponse
}

// all `returns` only for code compatibility
// after refactoring Form.js we not need this `returns`
export const getSimpleSwapEstimate = async (args: {
  updateTxn: (txnUpdate: TxnUpdate) => void
  type: TradeType
  tokenTo: Token
  sellAmount: BigNumber
  tokenNetwork: TokenNetwork
  tokenFrom: Token
}): Promise<BigNumber> => {
  try {
    const quoteResponse = await getSimpleSwapQuote(args)

    if (!quoteResponse) {
      const estimatedAmount = new BigNumber(0)

      args.updateTxn({
        key: args.type,
        patch: { quoteResponse: undefined, sourcesString: '', estimatedAmount },
      })

      return estimatedAmount
    }

    const sourcesString = quoteResponse.sources
      .filter((item: Source) => item.proportion > 0)
      .map((item: Source) => item.name)
      .join(', ')

    const estimatedAmount = new BigNumber(quoteResponse.buyAmount).dividedBy(
      10 ** args.tokenTo.decimals
    )
    args.updateTxn({
      key: args.type,
      patch: {
        quoteResponse,
        estimatedAmount,
        sourcesString,
      },
    })

    return estimatedAmount
  } catch (error) {
    console.error(error)
    const estimatedAmount = new BigNumber(0)

    args.updateTxn({
      key: args.type,
      patch: { quoteResponse: undefined, estimatedAmount, sourcesString: '' },
    })

    return estimatedAmount
  }
}

export const getSwapEstimateWithGas = async ({
  activeToken,
  tokenPriceUSD,
  slippage,
  tokenFrom,
  tokenTo,
  account,
  tokenNetwork,
  selectedGasPrice,
  debouncedTip,
  sellAmount,
  library,
  type,
  updateTxn,
}: {
  activeToken: Token
  tokenPriceUSD: TokenPriceUSD
  slippage: number
  tokenFrom?: Token
  tokenTo?: Token
  account: string
  tokenNetwork: TokenNetwork
  selectedGasPrice: BigNumber
  debouncedTip: number
  sellAmount: BigNumber
  library: any
  type: TradeType
  updateTxn: (txnUpdate: TxnUpdate) => void
}) => {
  try {
    if (!tokenFrom || !tokenTo) {
      throw new Error('tokenFrom and tokenTo cannot be empty')
    }
    if (selectedGasPrice === null) {
      throw new Error('gas price cannot be empty')
    }

    if (!sellAmount.gt(0)) {
      throw new Error('amount cannot be empty')
    }

    const fromTokenId = checkTokensAddressAndNetwork(tokenFrom, tokenNetwork)
      ? ZERO_X_ETH_ADDRESS
      : getTokenAddressFromId(tokenFrom)
    const toTokenId = checkTokensAddressAndNetwork(tokenTo, tokenNetwork)
      ? ZERO_X_ETH_ADDRESS
      : getTokenAddressFromId(tokenTo)

    const buyTokenPercentageFee = debouncedTip / 100
    const queryFee =
      buyTokenPercentageFee > 0
        ? {
            feeRecipient: referrerAddress,
            buyTokenPercentageFee,
          }
        : {}

    const slippageQuery = (slippage / 100).toFixed(4)

    // @ts-ignore
    const zeroXAPIUrl = zeroXAPIUrls[tokenNetwork]

    const takerAddress = `${account}`
    const gasPrice = selectedGasPrice.toFixed(0)

    const queryString = {
      sellToken: fromTokenId,
      buyToken: toTokenId,
      sellAmount: sellAmount.toFixed(0),
      slippagePercentage: slippageQuery,
      takerAddress,
      affiliateAddress: referrerAddress,
      gasPrice,
      ...queryFee,
    }

    const quoteResponse = await apiFetch(
      `${zeroXAPIUrl}/swap/v1/quote?${qs.stringify(queryString)}`,
      {
        onError: async (response: any) => {
          const responseJson = await response.json()
          const statusText = grabErrors(responseJson)

          throw new Error(statusText)
        },
      }
    )

    if (quoteResponse.message && quoteResponse.message === 'Error') {
      return null
    }

    const estimatedGasAmount = new BigNumber(quoteResponse.gas)
    const fromAmount = quoteResponse
      ? new BigNumber(quoteResponse.sellAmount).div(10 ** tokenFrom.decimals)
      : undefined

    const { gasCosts, isEnoughEthForGas } = await calculateGasCosts({
      estimatedGasAmount,
      selectedGasPrice,
      account,
      tokenNetwork,
      tokenFrom,
      activeToken,
      tokenPriceUSD,
      library,
      fromAmount,
    })

    const amount = new BigNumber(quoteResponse.buyAmount).dividedBy(10 ** tokenTo.decimals)

    const txnParams = {
      from: account,
      to: quoteResponse.to,
      data: quoteResponse.data,
      gasPrice: quoteResponse.gasPrice,
      gas: quoteResponse.gas,
      value: quoteResponse.value,
    }

    updateTxn({
      key: type,
      patch: {
        quoteResponse,
        txnParams,
        amount,
        estimatedGasAmount,
        gasCosts,
        isEnoughEthForGas,
      },
    })

    // * code compatibility
    return {
      amount,
      estimatedGasAmount,
      quoteResponse,
      gasCosts,
      isEnoughEthForGas,
    }
  } catch (err) {
    console.error(err)

    updateTxn({
      key: type,
      patch: {
        txnError: err.message || 'something went wrong',
      },
    })
  }
}

// need more tests
export const getSwapEstimate = async ({
  slippage,
  tokenFrom,
  tokenTo,
  account,
  tokenNetwork,
  selectedGasPrice,
  debouncedTip,
  sellAmount,
  type,
  updateTxn,
  onClose,
}: {
  slippage: number
  tokenFrom: Token
  tokenTo: Token
  account: string
  tokenNetwork: TokenNetwork
  selectedGasPrice?: BigNumber
  debouncedTip: number
  sellAmount: BigNumber
  type: TradeType
  updateTxn: (txnUpdate: TxnUpdate) => void
  onClose: () => void
}) => {
  if (selectedGasPrice === null) {
    return
  }

  if (!sellAmount.gt(0)) {
    return
  }

  const fromTokenId = checkTokensAddressAndNetwork(tokenFrom, tokenNetwork)
    ? ZERO_X_ETH_ADDRESS
    : getTokenAddressFromId(tokenFrom)
  const toTokenId = checkTokensAddressAndNetwork(tokenTo, tokenNetwork)
    ? ZERO_X_ETH_ADDRESS
    : getTokenAddressFromId(tokenTo)

  const fee = debouncedTip / 100
  const queryFee = fee > 0 ? { feeRecipient: referrerAddress, buyTokenPercentageFee: fee } : {}

  const slippageQuery = (slippage / 100).toFixed(4)
  // @ts-ignore
  const zeroXAPIUrl = zeroXAPIUrls[tokenNetwork]

  const queryString = {
    sellToken: fromTokenId,
    buyToken: toTokenId,
    sellAmount: sellAmount.toFixed(0),
    slippagePercentage: slippageQuery,
    takerAddress: `${account}`,
    affiliateAddress: referrerAddress,
    ...queryFee,
  }

  const quoteResponse = await apiFetch(
    `${zeroXAPIUrl}/swap/v1/quote?${qs.stringify(queryString)}`,
    {
      onError: async (response: any) => {
        const responseJson = await response.json()
        const statusText = grabErrors(responseJson)

        throw new Error(statusText)
      },
    }
  )

  if (quoteResponse.message && quoteResponse.message === 'Error') {
    onClose()
    return
  }

  const estimatedGasAmount = new BigNumber(quoteResponse.gas)

  const txnParams = {
    from: account,
    to: quoteResponse.to,
    data: quoteResponse.data,
    gasPrice: quoteResponse.gasPrice,
    gas: quoteResponse.gas,
    value: quoteResponse.value,
  }

  const amount = new BigNumber(quoteResponse.buyAmount).dividedBy(10 ** tokenTo.decimals)

  updateTxn({
    key: type,
    patch: {
      quoteResponse,
      txnParams,
      estimatedGasAmount,
      amount,
    },
  })

  // * code compatibility
  return amount
}

export const clearTransaction = ({
  updateTxn,
  type,
}: {
  updateTxn: (txnUpdate: TxnUpdate) => void
  type: TradeType
}) => {
  updateTxn({
    key: type,
    patch: {
      isLoading: false,
      hashTxn: undefined,
      txnVerificationComplete: false,
      txnVerificationSuccess: false,
      balanceHasChanged: false,
      type: type,
      sourcesString: '',
      gasPrice: undefined,
      txnParams: {},
    },
  })
}

export const calculateTokenUsdPrices = ({
  activeToken,
  tokenFrom,
  tokenTo,
}: {
  activeToken: Token
  tokenFrom: Token
  tokenTo: Token
}) => {
  if (!activeToken) return
  const fromTokenUsdPrice = new BigNumber(tokenFrom.priceUSD)
  const toTokenUsdPrice = new BigNumber(tokenTo.priceUSD)
  return { fromTokenUsdPrice, toTokenUsdPrice }
}
