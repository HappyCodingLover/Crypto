import React, { useState, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import Arrow from '../../images/icons/arrow.svg'
import Middle from '../../images/icons/emoji/tongue-center.svg'
import Low from '../../images/icons/emoji/crying.svg'
import Hight from '../../images/icons/emoji/tongue-right.svg'
import IconToolTips from '../../images/icons/icon-tooltips.svg'
import { DEFAULT_TIP } from '../../config/settings'
import { maxTip, minTip, tipHighThreshold, tipMiddleThreshold, tipStep } from './resources'

const TipOptionsMobile = ({ onChange }: { onChange: (value: any) => void }) => {
  const [tip, setTip] = useState(DEFAULT_TIP)

  useEffect(() => {
    onChange && onChange(tip)
  }, [tip, onChange])

  const incrementClickHandler = () => {
    let ntips = tip + tipStep
    if (ntips > maxTip) {
      ntips = maxTip
    }
    setTip(ntips)
  }

  const decrementClickHandler = () => {
    let ntips = tip - tipStep
    if (ntips < minTip) {
      ntips = minTip
    }
    setTip(ntips)
  }

  let emoji = <Low />

  if (tip >= tipMiddleThreshold) {
    emoji = <Middle />
  }

  if (tip > tipHighThreshold) {
    emoji = <Hight />
  }

  return (
    <div className="tips-mobile">
      <div className="row">
        <div className="label__container">
          <span className="label">Tips:</span>
          <span
            className="wrapper-svg"
            data-for="gas-cost-tooltip"
            data-tip="We don't charge you additional fees but your tips are highly appreciated and support our development and help us to build the best user experience for our traders">
            <IconToolTips />
          </span>
          <ReactTooltip id="gas-cost-tooltip" className="custom-tooltip" effect="solid" />
        </div>
        <div className="value__container">
          <button onClick={decrementClickHandler} className="modal-tips__button">
            <div className="increment">
              <Arrow />
            </div>
          </button>
          <button onClick={incrementClickHandler} className="modal-tips__button">
            <div className="decrement">
              <Arrow />
            </div>
          </button>
          <div className="modal-tips__label">{`${tip.toFixed(2)}%`}</div>
          {emoji}
        </div>
      </div>
    </div>
  )
}

export default TipOptionsMobile
