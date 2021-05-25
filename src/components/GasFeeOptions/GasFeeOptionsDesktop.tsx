import React from 'react'
import ReactTooltip from 'react-tooltip'
import IconToolTips from '../../images/icons/icon-tooltips.svg'
import { tooltipText } from './resources'
import { getGasValuesForShow } from '../../helpers/verifyHelpers'
import BigNumber from 'bignumber.js'

interface GasFeeOptionsDesktopProps {
  onGasPriceUpdate: (value: { gasFee: BigNumber }) => void
  activeGas: string
  gasPrice?: any
}

const GasFeeOptionsDesktop = ({
  onGasPriceUpdate,
  activeGas,
  gasPrice,
}: GasFeeOptionsDesktopProps) => {
  const { fast, instant, overkill } = getGasValuesForShow(gasPrice)

  const onClick = async (e: any) => {
    const gasFee = e.currentTarget.getAttribute('data-type')
    onGasPriceUpdate({ gasFee })
  }

  return (
    <div className="body-action-row">
      <div className="column">
        <div className="tooltips">
          <span className="label">GAS price:</span>
          <span className="wrapper-svg" data-for="gas-price-tooltip" data-tip={tooltipText}>
            <IconToolTips />
          </span>
          <ReactTooltip
            id="gas-price-tooltip"
            className="custom-tooltip"
            effect="solid"
            html={true}
          />
        </div>
      </div>
      <div className="column">
        <div className="group-button group-button-gas">
          <button
            className={`button large opacity ${activeGas === 'fast' && 'active'}`}
            data-value={fast}
            data-type="fast"
            onClick={onClick}>
            {fast?.toFixed(0)}&nbsp;Fast
          </button>
          <button
            className={`button large opacity ${activeGas === 'instant' && 'active'}`}
            data-value={instant}
            data-type="instant"
            onClick={onClick}>
            {instant?.toFixed(0)}&nbsp;Instant
          </button>
          <button
            className={`button large opacity ${activeGas === 'overkill' && 'active'}`}
            data-value={overkill}
            data-type="overkill"
            onClick={onClick}>
            {overkill?.toFixed(0)}&nbsp;Overkill
          </button>
        </div>
      </div>
    </div>
  )
}

export default GasFeeOptionsDesktop
