import React, { useEffect, useState } from 'react'
import { blockExplorerIcons, blockExplorerUrls } from '../config/settings'
import {
  financialFormat,
  getTokenAddressFromId,
  isTitleNaN,
  replaceWrapperTokenToToken,
} from '../utils'
import AnimatedArrow from '../images/icons/direction-down.svg'
import Slide from './Slide'
import accounting from 'accounting'
import AnimatedDrop from './AnimatedDrop'
import IconTokenComponent from './IconTokenComponent'
import { Token, TokenIcon, TokenNetwork } from '../index'
import BigNumber from 'bignumber.js'

let BlockExplorerIcon = null

interface SwapSummaryProps {
  tokenFrom?: Token
  tokenTo?: Token
  activeToken: Token
  fromAmount?: BigNumber | null
  tokenNetwork: TokenNetwork
  toAmount: BigNumber
  previousToAmount?: BigNumber
  fromAmountSelectedCurrency: BigNumber
  previousFromAmountCurrency?: BigNumber
  toAmountSelectedCurrency: BigNumber
  previousToAmountCurrency?: BigNumber
  delta: number
}

const SwapSummary = ({
  tokenFrom,
  tokenTo,
  activeToken,
  fromAmount,
  tokenNetwork,
  toAmount,
  previousToAmount,
  fromAmountSelectedCurrency,
  previousFromAmountCurrency,
  toAmountSelectedCurrency,
  previousToAmountCurrency,
  delta,
}: SwapSummaryProps) => {
  const [IconTokenFrom, setIconTokenFrom] = useState<TokenIcon>(null)
  const [IconTokenTo, setIconTokenTo] = useState<TokenIcon>(null)

  BlockExplorerIcon = blockExplorerIcons[tokenNetwork]

  const getTokenIcons = async () => {
    if (tokenFrom?.icon) {
      const fromTokenIcon = tokenFrom.icon
      setIconTokenFrom(fromTokenIcon)
    }
    if (tokenTo?.icon) {
      const toTokenIcon = tokenTo.icon
      setIconTokenTo(toTokenIcon)
    }
  }

  useEffect(() => {
    getTokenIcons()
  }, [tokenFrom, tokenTo])

  return (
    <div className="swap-summary">
      <div className="body-data">
        <div className="body-data-row">
          <div className="main-data">
            <div className="token">
              <span className={`icon token-border-network ${activeToken.network}`}>
                <div className="token-border large">
                  <IconTokenComponent IconToken={IconTokenFrom} symbol={tokenFrom?.symbol} />
                </div>
              </span>
              <div className="name">{replaceWrapperTokenToToken(tokenFrom?.symbol)}</div>
            </div>
            <div className="value" title={isTitleNaN(fromAmount?.toFixed())}>
              {financialFormat(fromAmount?.toFixed())}
            </div>
          </div>
          <div className="additional">
            <div className="token">
              <a
                href={`${blockExplorerUrls[tokenNetwork]}/token/${getTokenAddressFromId(
                  tokenFrom
                )}`}
                target="_blank"
                rel="noopener noreferrer">
                <BlockExplorerIcon />
                <span>{tokenFrom?.name}</span>
              </a>
              <div className="arrow">
                <AnimatedArrow />
              </div>
            </div>
            {fromAmountSelectedCurrency?.gt(0) ? (
              <div className="value" title={isTitleNaN(fromAmountSelectedCurrency?.toFixed())}>
                ~<span className="sign">$</span>
                <Slide
                  value={accounting.formatNumber(
                    Number(fromAmountSelectedCurrency?.toFixed() || 0),
                    4
                  )}
                  previousValue={previousFromAmountCurrency?.toFixed()}
                />
              </div>
            ) : (
              <AnimatedDrop isCost={false} />
            )}
          </div>
        </div>
        <div className="body-data-row">
          <div className="main-data">
            <div className="token">
              <span className={`icon token-border-network ${activeToken.network}`}>
                <div className="token-border large">
                  <IconTokenComponent IconToken={IconTokenTo} symbol={tokenTo?.symbol} />
                </div>
              </span>
              <div className="name">{replaceWrapperTokenToToken(tokenTo?.symbol)}</div>
            </div>
            <div className="value" title={isTitleNaN(toAmount?.toFixed())}>
              <Slide
                value={accounting.formatNumber(Number(toAmount?.toFixed() || 0), 4)}
                previousValue={previousToAmount?.toFixed()}
              />
            </div>
          </div>
          <div className="additional">
            <div className="token">
              <a
                href={`${blockExplorerUrls[tokenNetwork]}/token/${getTokenAddressFromId(tokenTo)}`}
                target="_blank"
                rel="noopener noreferrer">
                <BlockExplorerIcon />
                <span>{tokenTo?.name}</span>
              </a>
            </div>
            {toAmountSelectedCurrency && toAmountSelectedCurrency.gt(0) && (
              <div className="value" title={isTitleNaN(toAmountSelectedCurrency?.toFixed())}>
                ~<span className="sign">$</span>
                <Slide
                  value={accounting.formatNumber(
                    Number(toAmountSelectedCurrency?.toFixed() || 0),
                    2
                  )}
                  previousValue={previousToAmountCurrency?.toFixed()}
                />
                &nbsp;({delta > 1 ? delta?.toFixed(2) : delta?.toFixed(2)}%)
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SwapSummary
