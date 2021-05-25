import { BigNumber } from 'bignumber.js'
import { GasType } from '../config/verifyConstants'
import { GasFeeType, GasPrice } from '../index'

export const calculateGasPrices = (gasPriceData: GasPrice): GasPrice => {
  return {
    fast: new BigNumber(gasPriceData.fast),
    instant: new BigNumber(gasPriceData.instant),
    overkill: new BigNumber(gasPriceData.instant).times(1.3),
  }
}

export const getGasValuesForShow = (gasPrice: GasPrice): GasPrice => {
  const fast = gasPrice.fast.div(10 ** 9)
  const instant = gasPrice.instant.div(10 ** 9)
  const overkill = gasPrice.overkill.div(10 ** 9)

  return { fast, instant, overkill }
}

export const getGasPriceByKey = (gasPrice: GasPrice, key: GasFeeType): BigNumber => {
  let selected = gasPrice[key]
  if (key === GasType.overkill) {
    selected = new BigNumber(gasPrice.instant).times(1.3).isInteger()
      ? new BigNumber(gasPrice.instant).times(1.3)
      : new BigNumber(gasPrice.instant).times(1.3).dp(0, BigNumber.ROUND_DOWN)
  }
  return selected
}
