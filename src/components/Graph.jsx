import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
/*import TVChartContainer from './TVChartContainer'*/
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import { DEFAULT_SYMBOL_NAME } from '../config/settings'

export default function Graph(props) {
  const activeToken = useSelector((state) => state.currentToken)
  const selectedCurrency = useSelector((state) => state.currency)
  const isMobile = useSelector((state) => state.isMobile)
  const [symbolName, setSymbol] = useState(() => {
    return activeToken?.id || DEFAULT_SYMBOL_NAME
  })

  useEffect(() => {
    const loadData = async () => {
      // Here's an example of converting TV chart to USD and reversing (should be implemented thru buttons)
      if (selectedCurrency === 'USD') {
        setSymbol(activeToken.id + '_USD')
      } else {
        setSymbol(activeToken.id + '_ETH')
      }
    }

    loadData()
  }, [activeToken, selectedCurrency])
  useEffect(()=>{
      props.setLoading(true);
  },[])
  return (
    <div className="graph" style={{height:430,padding:10}}>
        <TradingViewWidget symbol={activeToken.symbol? (activeToken.symbol=="WBNB"?"BNB":activeToken.symbol) + "USD":"BTCUSD"}
                           theme={Themes.DARK}
                           locale="en"
                           autosize
        />
      {/*<TVChartContainer symbolName={symbolName} setLoading={props.setLoading} isMobile={isMobile} />*/}
    </div>
  )
}
