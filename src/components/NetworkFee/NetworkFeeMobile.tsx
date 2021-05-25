import React from 'react'
import ReactTooltip from 'react-tooltip'
import Poop from '../../images/icons/emoji/poop.svg'
import GasStation from '../../images/icons/emoji/gasstation.svg'
import IconToolTips from '../../images/icons/icon-tooltips.svg'
import AnimatedDrop from '../AnimatedDrop'
import Slide from '../Slide.jsx'
import { usePrevious } from '../../hooks'
import { tooltipText } from './resources'
import { feeTitle, isPoop } from '../LimitsOptions/resources'
import BigNumber from 'bignumber.js'

interface NetworkFeeMobileProps {
  activeToken: any
  gasCosts: BigNumber
  fromAmountSelectedCurrency: BigNumber
  isTokenApproved: boolean
  isEnoughEthForGas: boolean
}

const NetworkFeeMobile = ({
  gasCosts,
  fromAmountSelectedCurrency,
  isTokenApproved,
  isEnoughEthForGas,
  activeToken,
}: NetworkFeeMobileProps) => {
  const previousGasCosts: BigNumber | undefined = usePrevious<BigNumber>(gasCosts)
  const isPoopCost = isPoop(gasCosts, fromAmountSelectedCurrency)
  const isEnoughAndApproved = isTokenApproved && isEnoughEthForGas
  const gasCostGt0 = gasCosts.gt(0)

  return (
    <div className="network-fee-mobile">
      <div className="row">
        <div className="label__container">
          <span className="label">{feeTitle(activeToken)}</span>
          <span className="wrapper-svg" data-for="gas-cost-tooltip" data-tip={tooltipText}>
            <IconToolTips />
          </span>
          <ReactTooltip
            id="gas-cost-tooltip"
            className="custom-tooltip"
            effect="solid"
            html={true}
          />
        </div>
        <div className="value__container">
          {isEnoughAndApproved && gasCostGt0 && (
            <>
              <span className="sign">$</span>
              <Slide
                value={gasCosts.toFixed()}
                previousValue={previousGasCosts?.toFixed()}
                className="value"
              />
            </>
          )}
          {isEnoughAndApproved && !gasCostGt0 && (
            <div className="drop">
              <AnimatedDrop isCost={true} />
            </div>
          )}
          {isTokenApproved && isEnoughEthForGas && isPoopCost && <Poop />}
          {isTokenApproved && !isEnoughEthForGas && <GasStation />}
          {!isTokenApproved && <span>Before placing a trade you need to approve token first</span>}
        </div>
      </div>
    </div>
  )
}

export default NetworkFeeMobile
