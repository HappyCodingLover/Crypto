import IconToolTips from '../../images/icons/icon-tooltips.svg'
import ReactTooltip from 'react-tooltip'
import React from 'react'
import Slide from '../Slide'
import AnimatedDrop from '../AnimatedDrop'
import Poop from '../../images/icons/emoji/poop.svg'
import { tooltipText } from './resources'
import { feeTitle, isPoop } from '../LimitsOptions/resources'
import BigNumber from 'bignumber.js'

interface NetworkFeeDesktopProps {
  activeToken: any
  gasCosts: BigNumber
  previousGasCosts?: BigNumber
  fromAmountSelectedCurrency: BigNumber
}

const NetworkFeeDesktop = ({
  activeToken,
  gasCosts,
  previousGasCosts,
  fromAmountSelectedCurrency,
}: NetworkFeeDesktopProps) => {
  return (
    <div className="body-action-row">
      <div className="column">
        <div className="tooltips">
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
      </div>
      <div className="column result-cost">
        {gasCosts.gt(0) ? (
          <React.Fragment>
            <span className="sign">$</span>
            <Slide
              value={gasCosts?.toFixed() || 0}
              previousValue={previousGasCosts?.toFixed() || 0}
              className="value"
            />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <AnimatedDrop isCost={true} />
          </React.Fragment>
        )}
        {isPoop(gasCosts, fromAmountSelectedCurrency) && (
          <div className="poop">
            <Poop />
          </div>
        )}
      </div>
    </div>
  )
}

export default NetworkFeeDesktop
