import React from 'react'

interface BuySellSwitchProps {
  onBuyClick: () => void
  onSellClick: () => void
}

const BuySellSwitch = ({ onBuyClick, onSellClick }: BuySellSwitchProps) => (
  <div className="mobile-buy-sell-container">
    <div className="mobile-buy-sell-button buy" onClick={onBuyClick}>
      Buy
    </div>
    <div className="mobile-buy-sell-button sell" onClick={onSellClick}>
      Sell
    </div>
  </div>
)

export default BuySellSwitch
