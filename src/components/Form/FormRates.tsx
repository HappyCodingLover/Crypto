import React from 'react'
import { financialFormat, isTitleNaN, replaceWrapperTokenToToken } from '../../utils'
import accounting from 'accounting'
import { BigNumber } from 'bignumber.js'
import { Token } from '../../index'

interface FormRatesProps {
  sources: string
  isEmpty: boolean
  ratioUsdPrice: BigNumber
  tokenFrom?: Token
  tokenTo?: Token
}

const FormRates = ({ sources, isEmpty, ratioUsdPrice, tokenFrom, tokenTo }: FormRatesProps) => (
  <div className="form-row">
    <div className="form-row-title">
      {sources && !isEmpty ? (
        <React.Fragment>
          <span>
            Via&nbsp;<span className="value-grey">{sources}</span>
          </span>
        </React.Fragment>
      ) : (
        <React.Fragment>
          <span>Price:&nbsp;</span>
        </React.Fragment>
      )}

      <span>
        1&nbsp;
        <span className="value-opacity">{replaceWrapperTokenToToken(tokenFrom?.symbol)}</span>
        &nbsp;=&nbsp;
        <span title={isTitleNaN(accounting.formatNumber(ratioUsdPrice.toNumber(), 6))}>
          {financialFormat(ratioUsdPrice.toNumber())}
        </span>
        &nbsp;
        <span className="value-opacity">{replaceWrapperTokenToToken(tokenTo?.symbol)}</span>
        &nbsp;=&nbsp;
        <span
          title={isTitleNaN(
            accounting.formatNumber(Number(new BigNumber(tokenFrom?.priceUSD || 0).toFixed()), 6)
          )}>
          {financialFormat(new BigNumber(tokenFrom?.priceUSD || 0).toFixed())}
        </span>
        &nbsp;
        <span className="value-opacity">USD</span>
      </span>
    </div>
  </div>
)

export default FormRates
