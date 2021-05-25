import React from 'react'
import cn from 'classnames'

interface LimitsOptionsItemProps {
  id: number
  value: string
  onSelect: (values: { id: number; value: string }) => void
  selected: boolean
}
const LimitsOptionsItem = ({ id, value, onSelect, selected = false }: LimitsOptionsItemProps) => {
  const clickHandler = () => {
    onSelect({ id, value })
  }

  return (
    <div className={cn('option-item small', { selected })} onClick={clickHandler}>
      <div className={cn('option-item__label', { selected })}>{value}</div>
    </div>
  )
}

export default LimitsOptionsItem
