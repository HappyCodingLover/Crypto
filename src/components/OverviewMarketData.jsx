import classNames from 'classnames'
import React from 'react'
import { financialFormat, numberWithCommas, isTitleNaN } from '../utils'

export default function OverviewMarketData({ coingeckoData, activeToken, isMobile }) {
  const { market_data } = coingeckoData

  if (!market_data) {
    return <div className="overview__market overview__market_empty">No Data</div>
  }

  let marketCapUsd =
    (market_data?.market_cap &&
      `$${numberWithCommas(Number(market_data.market_cap.usd).toFixed(0))}`) ||
    undefined

  const marketCapRank = coingeckoData.market_cap_rank || undefined

  const maxSupply =
    (market_data?.total_supply && numberWithCommas(Number(market_data.total_supply).toFixed(0))) ||
    undefined

  const circulatingSupply =
    (market_data?.circulating_supply &&
      numberWithCommas(Number(market_data.circulating_supply).toFixed(0))) ||
    undefined

  if ((!marketCapUsd || marketCapUsd === '$0') && !circulatingSupply && maxSupply) {
    marketCapUsd = `$${numberWithCommas(
      Number(market_data.total_supply * activeToken.priceUSD).toFixed(0)
    )}`
  }
  if ((!marketCapUsd || marketCapUsd === '$0') && circulatingSupply) {
    marketCapUsd = `$${numberWithCommas(
      Number(market_data.circulating_supply * activeToken.priceUSD).toFixed(0)
    )}`
  }

  const fullyDilutedValuationUsd = maxSupply
    ? `$${numberWithCommas(
        Number(Number(market_data.total_supply) * activeToken.priceUSD).toFixed(0)
      )}`
    : (market_data?.fully_diluted_valuation?.usd &&
        `$${numberWithCommas(Number(market_data.fully_diluted_valuation.usd).toFixed(0))}`) ||
      undefined

  return (
    <div className="overview__market">
      <div className={classNames('properties', { 'properties--cols-2': !isMobile })}>
        {!isMobile && (
          <div className="properties-entry">
            <div className="properties-entry__title">Price</div>
            <div className="properties-entry__body">
              <span title={activeToken.priceUSD} className="sum">
                {`$` + financialFormat(activeToken.priceUSD)}
              </span>
              <span className="delta">
                <sup
                  className={`triangle ${activeToken.priceChange24h > 0 ? 'up' : 'down'}`}
                  title={isTitleNaN(
                    numberWithCommas(Math.abs(activeToken.priceChange24h) * 100, 2)
                  )}>
                  {financialFormat(Math.abs(activeToken.priceChange24h) * 100, 2)}%
                </sup>
              </span>
            </div>
          </div>
        )}
        {marketCapUsd && (
          <div className="properties-entry">
            <strong className="properties-entry__title">Market Cap</strong>
            <div className="properties-entry__body">{marketCapUsd}</div>
          </div>
        )}
        {(circulatingSupply || maxSupply) && (
          <div className="properties-entry">
            <strong className="properties-entry__title">Circulating Supply</strong>
            <div className="properties-entry__body">
              {circulatingSupply && circulatingSupply}
              {circulatingSupply && maxSupply && ' / '}
              {maxSupply && `${maxSupply}`}
            </div>
          </div>
        )}
        {maxSupply && (
          <div className="properties-entry">
            <strong className="properties-entry__title">Max Supply</strong>
            <div className="properties-entry__body">{maxSupply}</div>
          </div>
        )}
        {fullyDilutedValuationUsd && (
          <div className="properties-entry">
            <strong className="properties-entry__title">Fully Diluted Valuation</strong>
            <div className="properties-entry__body">{fullyDilutedValuationUsd}</div>
          </div>
        )}

        {marketCapRank && <div className="overview__rank">{`Rank #${marketCapRank}`}</div>}
      </div>
    </div>
  )
}
