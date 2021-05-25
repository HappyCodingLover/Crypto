import React, { useState, useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import TooltipsIcon from '../../images/icons/tooltip-small.svg'
import GasFeeItemSettings from './GasFeeItemSettings'
import { tooltipText, options } from './resources'
import BigNumber from 'bignumber.js'

interface GasFeeSettingsProps {
  updateSettings: (values: { gasFee: string }) => void
  gasFee: BigNumber
}
const GasFeeSettings = ({ updateSettings, gasFee }: GasFeeSettingsProps) => {
  const [selected, setSelected] = useState<number | undefined>()

  useEffect(() => {
    const current = options.find(
      (option) => `${option.value}`.toUpperCase() === `${gasFee}`.toUpperCase()
    )
    setSelected(current?.id)
  }, [gasFee])

  const selectHandler = (option: any) => {
    setSelected(option.id)
    updateSettings({ gasFee: option.value.toLowerCase() })
  }

  const optionsElements = options.map((option) => (
    <GasFeeItemSettings
      key={option.id}
      selected={selected === option.id}
      onSelect={selectHandler}
      {...option}
    />
  ))

  return (
    <div className="settings-options">
      <div className="settings-options__title">
        <span>GAS fee:</span>
        <div className="settings-options__title-icon">
          <span
            className="wrapper-svg"
            data-iscapture="true"
            data-for="gas-price-tooltip-settings"
            data-tip={tooltipText}>
            <TooltipsIcon />
          </span>

          <ReactTooltip
            className="custom-tooltip"
            multiline={true}
            id="gas-price-tooltip-settings"
            effect="solid"
          />
        </div>
      </div>
      <div className="settings-options__container">{optionsElements}</div>
    </div>
  )
}

export default GasFeeSettings
