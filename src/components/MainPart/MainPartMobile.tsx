import React from 'react'
import gtmService from '../../services/gtmService'
import Graph from '../Graph'
import BuySellSwitch from './BuySellSwitchMobile'
import MainPartTabMobile from './MainPartTabMobile'
import { useSelector, useDispatch } from 'react-redux'
import * as actions from '../../actions'
import { useWeb3React } from '@web3-react/core'

interface MainPartMobileProps {
  setLoading: (value: boolean) => void
  openProviderMenu: () => void
}

const MainPartMobile = ({ openProviderMenu, setLoading }: MainPartMobileProps) => {
  const [isInForm, setIsInForm] = React.useState(false)
  const [isBuy, setIsBuy] = React.useState(true)
  const { account } = useWeb3React()
  const reduxDispatch = useDispatch()
  const currentToken = useSelector((state: any) => state.currentToken)
  const quoteToken = useSelector((state: any) => state.quoteToken)

  const buySellToggle = (isBuy: boolean) => () => {
    if (!account) {
      openProviderMenu()
      return
    }
    setIsBuy(isBuy)
    setIsInForm(true)
    const activeTradeType = isBuy ? 'Buy' : 'Sell'
    reduxDispatch(actions.activeTradeType(activeTradeType))

    // if user clicked on Selll, we count it as switch product view from base-quote to quote-base
    if (!isBuy) {
      gtmService.v3.viewProductDetails(currentToken, quoteToken)
      gtmService.v4.viewProductDetails(currentToken, quoteToken)
    }

    // this action is the same as ModalVerify opening on desktop
    gtmService.v3.addToCart(currentToken, quoteToken)
    gtmService.v4.addToCart(currentToken, quoteToken)
  }

  const onClose = () => {
    setIsInForm(false)
  }

  return (
    <div className="main main--mobile">
      <div className="main__wrapper">
        {isInForm && (
          <div className="main__form buy-sell-bottom">
            <div className="wrapper-form mobile">
              <div className="mobile-tabs-wrapper form">
                <MainPartTabMobile
                  checked={isBuy}
                  tradeType="Buy"
                  title="Buy"
                  buySellToggle={buySellToggle(true)}
                  openProviderMenu={openProviderMenu}
                  onClose={onClose}
                />
                <MainPartTabMobile
                  checked={!isBuy}
                  tradeType="Sell"
                  title="Sell"
                  buySellToggle={buySellToggle(false)}
                  openProviderMenu={openProviderMenu}
                  onClose={onClose}
                />
              </div>
            </div>
          </div>
        )}
        <div className="main__body">
          <Graph setLoading={setLoading} />
        </div>
        <div className="main__footer">
          {!isInForm && (
            <BuySellSwitch onBuyClick={buySellToggle(true)} onSellClick={buySellToggle(false)} />
          )}
        </div>
      </div>
    </div>
  )
}

export default MainPartMobile
