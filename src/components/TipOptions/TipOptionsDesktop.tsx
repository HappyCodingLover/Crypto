import IconToolTips from '../../images/icons/icon-tooltips.svg'
import ReactTooltip from 'react-tooltip'
import Slider from 'rc-slider'
import React, { useEffect, useState } from 'react'
import { DEFAULT_TIP } from '../../config/settings'
import { maxTip, minTip, tipHighThreshold, tipMiddleThreshold, tipStep } from './resources'

const TipOptionsDesktop = ({ onChange }: { onChange: (value: any) => void }) => {
  const [tip, setTip] = useState(DEFAULT_TIP)

  useEffect(() => {
    onChange(tip)
  }, [tip, onChange])

  return (
    <div className="body-action-row pt-45">
      <div className="column">
        <div className="tooltips">
          <span className="label">Tip for your Guru:</span>
          <span
            className="wrapper-svg"
            data-for="gas-price-tooltip"
            data-tip="We don't charge you additional fees but your tips are highly appreciated and support our development and help us to build the best user experience for our traders">
            <IconToolTips />
          </span>
          <ReactTooltip id="gas-price-tooltip" className="custom-tooltip" effect="solid" />
        </div>
      </div>
      <div className="column slider-wrapper">
        <div className="slider-item">
          <div
            className={`tooltip-slider ${
              tip > tipHighThreshold ? 'high' : tip >= tipMiddleThreshold ? 'middle' : 'low'
            }`}
            style={{
              left: `calc(${100 * tip}% + 0.6px * (50 - ${100 * tip}) - 27px - 2 * ${
                (50 - 100 * tip) / 10
              }px`,
              transform: `rotate(${(50 - 100 * tip) * 0.6}deg)`,
              top: `calc(${Math.abs((50 - 100 * tip) / 10)}px - 50px)`,
            }}>
            {tip}%
          </div>
          <Slider min={minTip} max={maxTip} step={tipStep} defaultValue={tip} onChange={setTip} />
        </div>
      </div>
    </div>
  )
}

export default TipOptionsDesktop
