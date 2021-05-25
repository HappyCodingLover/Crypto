import IconToolTips from '../../images/icons/icon-tooltips.svg'
import ReactTooltip from 'react-tooltip'
import cn from 'classnames'
import React, { useEffect, useState } from 'react'
import { options, optionsWithFees, tooltipText, Options } from './resources'

interface LimitsOptionsDesktopProps {
  onSlippageUpdate: (slippage: number) => void
  slippage: string
  isDeltaShown: boolean
  hasFees: boolean
}

const checkSlippageInPreset = (options: Options, val: number) =>
  options.map((o) => Number(o.value)).includes(val)

const LimitsOptionsDesktop = ({
  onSlippageUpdate,
  slippage,
  isDeltaShown,
  hasFees,
}: LimitsOptionsDesktopProps) => {
  const [slippageInputValue, setSlippageInputValue] = useState<string>('')
  const [slippageValue, setSlippageValue] = useState<string | undefined>(undefined)
  const optionsValues = hasFees ? optionsWithFees : options

  useEffect(() => {
    const isInPreset = checkSlippageInPreset(optionsValues, parseFloat(slippage))

    let inputValue: string = slippage
    let value

    if (isInPreset) {
      inputValue = ''
      value = slippage
    }

    if (isDeltaShown) {
      inputValue = ''
      value = '1'
    }

    setSlippageInputValue(inputValue)
    setSlippageValue(value)
  }, [slippage, isDeltaShown, hasFees])

  const onBlurSlipPageInput = () => {
    const parsedValue = parseFloat(slippageInputValue)

    if (parsedValue && checkSlippageInPreset(optionsValues, parsedValue)) {
      setSlippageInputValue('')
      setSlippageValue(slippageInputValue)
    }

    onSlippageUpdate(parsedValue)
  }

  const onSlippageClick = async (btnValue: string) => {
    setSlippageInputValue('')
    setSlippageValue(btnValue)

    onSlippageUpdate(parseFloat(btnValue))
  }

  const onSlippageInputChange = async ({ target }: { target: any }) => {
    const parsedValue = parseFloat(target.value)
    setSlippageInputValue(String(parsedValue))
    setSlippageValue(undefined)
  }

  return (
    <div className="body-action-row slippage">
      <div className="column">
        <div className="tooltips">
          <span className="label">Limit additional price slippage:</span>
          <span className="wrapper-svg" data-for="slippage-price" data-tip={tooltipText}>
            <IconToolTips />
          </span>
          <ReactTooltip id="slippage-price" className="custom-tooltip" effect="solid" />
        </div>
      </div>
      <div className="column">
        <div className="group-button group-button-slippage">
          {optionsValues.map((o) => (
            <SlippageButton
              key={o.id}
              value={o.value}
              onClick={onSlippageClick}
              selectedSlippage={slippageValue}
            />
          ))}
        </div>
        <div className={`wrapper-input-slippage ${slippageInputValue ? `border-rainbow` : ``}`}>
          <input
            className="input-slippage"
            placeholder="Custom %"
            onChange={onSlippageInputChange}
            onBlur={onBlurSlipPageInput}
            value={slippageInputValue}
          />
        </div>
      </div>
    </div>
  )
}

const SlippageButton = ({
  value,
  onClick,
  selectedSlippage,
}: {
  value: string
  onClick: (event: any) => void
  selectedSlippage?: string
}) => (
  <button
    className={cn('button', 'opacity', { active: `${selectedSlippage}` === value })}
    data-value={value}
    onClick={() => onClick(value)}>
    {value}%
  </button>
)

export default LimitsOptionsDesktop
