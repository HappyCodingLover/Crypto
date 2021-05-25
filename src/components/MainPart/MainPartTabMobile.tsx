import React, { ChangeEventHandler } from 'react'
import cn from 'classnames'
import FormMobile from '../Form/FormMobile'
import { TradeType } from '../..'

interface MainPartTabMobileProps {
  checked: boolean
  tradeType: TradeType
  title: string
  openProviderMenu: () => void
  onClose: () => void
  buySellToggle: ChangeEventHandler<HTMLInputElement>
}

const MainPartTabMobile = ({
  tradeType,
  title,
  openProviderMenu,
  onClose,
  buySellToggle,
  checked,
}: MainPartTabMobileProps) => {
  return (
    <div className={cn('tab', { 'tab-left': tradeType === 'Buy' })}>
      <input
        type="radio"
        id={`tab-${tradeType.toLowerCase()}`}
        name="tab-group"
        checked={checked}
        onChange={buySellToggle}
      />
      <section className="tab-content">
        {checked && (
          <FormMobile tradeType={tradeType} openProviderMenu={openProviderMenu} onClose={onClose} />
        )}
      </section>
      <label htmlFor={`tab-${tradeType.toLowerCase()}`} className="tab-title">
        <div className="form-line top" />
        <div className="form-line bottom" />
        <div className="form-title">{title}</div>
      </label>
    </div>
  )
}

export default MainPartTabMobile
