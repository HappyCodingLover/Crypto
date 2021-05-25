import React from 'react'
import cn from 'classnames'
import Graph from '../Graph'
import FormDesktop from '../Form/FormDesktop'
import Footer from '../Footer'
import { Token, TradeType } from '../../index'
import { useSelector, useDispatch } from 'react-redux'
import gtmService from '../../services/gtmService'
import * as actions from '../../actions'

interface MainPartDesktopProps {
  setLoading: (value: boolean) => void
  openProviderMenu: () => void
  openSidebar: 'left' | 'right' | 'auto'
  openVerify: (tokenFrom: Token, tokenTo: Token, tradeType: TradeType) => void
}

const MainPartDesktop = ({
  openSidebar,
  setLoading,
  openVerify,
  openProviderMenu,
}: MainPartDesktopProps) => {
  const reduxDispatch = useDispatch()
  const currentToken = useSelector((state: any) => state.currentToken)
  const quoteToken = useSelector((state: any) => state.quoteToken)
  const onTabClick = (e: React.MouseEvent<HTMLInputElement>) => {
    const id = e.currentTarget.getAttribute('id')
    const activeTradeType: TradeType = id === 'tab-buy' ? 'Buy' : 'Sell'
    reduxDispatch(actions.activeTradeType(activeTradeType))
    gtmService.v3.viewProductDetails(currentToken, quoteToken)
    gtmService.v4.viewProductDetails(currentToken, quoteToken)
  }
  return (
    <div className={cn('main', 'main--desktop', { 'main--hide': openSidebar !== 'auto' })}>
      <div className="main__wrapper">

        <div className="main__body">
          <div className="graph-container">
                <Graph setLoading={setLoading} />
          </div>
          <div className="token-swap-container">
                <div className="wrapper-form">
                  <div className="tabs-wrapper form">
                    <div className="tab tab-left">
                      <input
                        type="radio"
                        id="tab-buy"
                        name="tab-group"
                        onClick={onTabClick}
                        defaultChecked
                      />
                      <label htmlFor="tab-buy" className="tab-title">
                        <div className="form-line" />
                        <div className="form-title">Buy</div>
                      </label>
                      <section className="tab-content">
                        <FormDesktop
                          tradeType="Buy"
                          openProviderMenu={openProviderMenu}
                          openVerify={openVerify}
                        />
                      </section>
                    </div>
                    <div className="tab">
                      <input type="radio" id="tab-sell" name="tab-group" onClick={onTabClick} />
                      <label htmlFor="tab-sell" className="tab-title">
                        <div className="form-line" />
                        <div className="form-title">Sell</div>
                      </label>
                      <section className="tab-content">
                        <FormDesktop
                          tradeType="Sell"
                          openProviderMenu={openProviderMenu}
                          openVerify={openVerify}
                        />
                      </section>
                    </div>
                  </div>
                </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MainPartDesktop
