import { TradeType, Transaction } from '../index'
import { AnyAction } from 'redux'

export const SET_TXN: string = 'SET_TXN'
export const UPDATE_TXN: string = 'UPDATE_TXN'
export const TX_VERIFICATION_COMPLETE: string = 'TX_VERIFICATION_COMPLETE'

const txn = (
  state: TxnState = {
    Buy: {
      isLoading: false,
      hashTxn: undefined,
      txnVerificationComplete: false,
      txnParams: {},
      balanceHasChanged: false,
      type: 'Buy',
      sourcesString: '',
      gasPrice: undefined,
    },
    Sell: {
      isLoading: false,
      hashTxn: undefined,
      txnVerificationComplete: false,
      txnParams: {},
      balanceHasChanged: false,
      type: 'Sell',
      sourcesString: '',
      gasPrice: undefined,
    },
  },
  action: AnyAction
) => {
  switch (action.type) {
    case SET_TXN: {
      const { key, txn } = action.payload
      return { ...state, [key]: { ...txn } }
    }
    case UPDATE_TXN: {
      const { key, patch }: TxnUpdate = action.payload
      return { ...state, [key]: { ...state[key], ...patch } }
    }
    case TX_VERIFICATION_COMPLETE: {
      const { key, status }: TxnUpdate = action.payload
      return {
        ...state,
        [action.key]: {
          ...state[key],
          txnVerificationComplete: status,
        },
      }
    }
    default:
      return state
  }
}

export interface TxnUpdate {
  key: TradeType
  patch?: Partial<Transaction>
  status?: boolean
}

export interface TxnState {
  Buy: Transaction
  Sell: Transaction
}

export default txn
