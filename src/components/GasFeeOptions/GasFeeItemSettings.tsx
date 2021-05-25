import React from 'react'
import cn from 'classnames'

interface GasFeeItemSettingsProps {
  id: number
  value: string
  onSelect: (values: { id: number; value: string }) => void
  selected: boolean
}

const GasFeeItemSettings = ({ id, value, onSelect, selected = false }: GasFeeItemSettingsProps) => {
  const clickHandler = () => {
    onSelect({ id, value })
  }

  return (
    <div className={cn('option-item', { selected })} onClick={clickHandler}>
      <div className={cn('option-item__label', { selected })}>{value}</div>
    </div>
  )
}

export default GasFeeItemSettings
