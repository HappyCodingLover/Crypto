import React, { useState, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import TooltipsIcon from '../../images/icons/tooltip-small.svg'
import LimitsOptionsItem from './LimitsOptionsItem'
import { tooltipText, options } from './resources'
import { SLIPPAGE_TAX_WHEN_FEES } from '../../config/settings'

interface LimitsOptionsMobileProps {
  updateSettings: (value: { slippage: string; slippageWithFees: string }) => void
  slippage: number
}
const LimitsOptionsMobile = ({ updateSettings, slippage }: LimitsOptionsMobileProps) => {
  const [selected, setSelected] = useState<number | undefined>()
  const [percentValue, setPercentValue] = useState<number | undefined>()

  useEffect(() => {
    const current = options.find((option) => `${option.value}` === `${slippage}`)

    if (!current) {
      return setPercentValue(slippage)
    }

    return setSelected(current.id)
  }, [slippage])

  const changePercentHandler = ({ target }: { target: any }) => {
    setPercentValue(target.value)
    setSelected(undefined)
    updateSettings({
      slippage: target.value,
      slippageWithFees: SLIPPAGE_TAX_WHEN_FEES + target.value,
    })
  }

  const selectHandler = (option: any) => {
    setPercentValue(undefined)
    setSelected(option.id)
    updateSettings({
      slippage: option.value,
      slippageWithFees: SLIPPAGE_TAX_WHEN_FEES + option.value,
    })
  }

  const optionsElements = options.map((option) => (
    <LimitsOptionsItem
      key={option.id}
      selected={selected === option.id}
      onSelect={selectHandler}
      {...option}
    />
  ))

  return (
    <div className="settings-options">
      <div className="settings-options__title">
        <span>Limit additional price slippage:</span>
        <div className="settings-options__title-icon">
          <span
            className="wrapper-svg"
            data-iscapture="true"
            data-for="slippage-tooltip-settings"
            data-tip={tooltipText}>
            <TooltipsIcon />
          </span>

          <ReactTooltip
            className="custom-tooltip"
            multiline={true}
            id="slippage-tooltip-settings"
            effect="solid"
          />
        </div>
      </div>
      <div className="settings-options__container">
        {optionsElements}
        <div className="percent-inputs">
          <input
            type="text"
            placeholder="20 %"
            onChange={changePercentHandler}
            value={percentValue}
          />
        </div>
      </div>
    </div>
  )
}

export default LimitsOptionsMobile
