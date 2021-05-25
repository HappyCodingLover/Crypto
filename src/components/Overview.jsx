import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { getCoingeckoData } from '../services/dyor'
import CopyToClipboard from './CopyToClipboard'
import IconClose from '../images/icons/close.svg'
import TokenEth from '../images/icons/tokens/eth.svg'
import TokenBNB from '../images/icons/tokens/bnb.svg'
import Discord from '../images/icons/social-discord.svg'
import Twitter from '../images/icons/social-twitter.svg'
import Telegram from '../images/icons/social-telegram.svg'
import { WETH_ADDRESS, WBNB_ADDRESS } from '../config/tokens'
import { getShortAccount, replaceWrapperTokenToToken, getTokenAddressFromId, sleep } from '../utils'
import {
  blockExplorerUrls,
  blockExplorerIcons,
  DEFAULT_DELAY_PRELOADER_DYOR,
} from '../config/settings'
import OverviewMarketData from './OverviewMarketData'
import AnimatedMushroom from './AnimatedMushroom'
import IconTokenComponent from './IconTokenComponent'
let BlockExplorerIcon = null

const hostNameStr = (url) => {
  try {
    const hostName = window.URL && new window.URL(url).hostname

    return hostName
  } catch (err) {
    return url
  }
}

export default function Overview(props) {
  const [isLoading, setLoading] = useState(true)
  const activeToken = useSelector((state) => state.currentToken)
  const isMobile = useSelector((state) => state.isMobile)
  const tokenNetwork = activeToken.network
  const tokenAddress = getTokenAddressFromId(activeToken)

  BlockExplorerIcon = blockExplorerIcons[tokenNetwork]
  const [coingeckoData, setCoingeckoData] = useState(undefined)
  const [IconToken, setIconToken] = useState(null)

  useEffect(() => {
    getCoingeckoData(activeToken)
      .then(setCoingeckoData)
      .then(() => {
        return sleep(DEFAULT_DELAY_PRELOADER_DYOR).then(() => {
          return setLoading(false)
        })
      })
  }, [activeToken])

  useEffect(() => {
    if (activeToken.icon) {
      const icon = activeToken.icon
      setIconToken(icon)
    }
  }, [tokenAddress, activeToken])

  if (!coingeckoData) {
    return null
  }

  let homepageUrls = coingeckoData?.links?.homepage || []

  const twitterLink =
    (coingeckoData.links &&
      coingeckoData.links.twitter_screen_name &&
      `https://twitter.com/${coingeckoData.links.twitter_screen_name}`) ||
    undefined

  const telegramLink =
    (coingeckoData.links &&
      coingeckoData.links.telegram_channel_identifier &&
      `https://t.me/${coingeckoData.links.telegram_channel_identifier}`) ||
    undefined

  const discordLink =
    (coingeckoData.links && coingeckoData.links.chat_url && coingeckoData.links.chat_url[0]) ||
    undefined

  function renderSocialNetworks() {
    if (twitterLink || telegramLink || discordLink) {
      return (
        <div className="overview__contacts">
          <div className="attributes">
            <div className="attributes-entry">
              <strong className="attributes-entry__title">Community</strong>
              <div className="attributes-entry__body">
                <div className="row row--gap-md">
                  {twitterLink && (
                    <div className="cell--auto">
                      <a
                        href={twitterLink}
                        target="_blank"
                        className="icon social-icon"
                        rel="noreferrer">
                        {<Twitter />}
                      </a>
                    </div>
                  )}
                  {telegramLink && (
                    <div className="cell--auto">
                      <a
                        href={telegramLink}
                        target="_blank"
                        className="icon social-icon"
                        rel="noreferrer">
                        {<Telegram />}
                      </a>
                    </div>
                  )}
                  {discordLink && (
                    <div className="cell--auto">
                      <a
                        href={discordLink}
                        target="_blank"
                        className="icon social-icon"
                        rel="noreferrer">
                        {<Discord />}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    } else {
      return null
    }
  }

  function renderOverviewHeader() {
    return (
      <div className="overview__header">
        {!isMobile && (
          <div className="overview__token-icon">
            <div className={`token-icon token-border-network  ${activeToken.network}`}>
              <div className="token-border large">
                <IconTokenComponent IconToken={IconToken} symbol={activeToken.symbol} />
              </div>
            </div>
            <div className="token-name">{replaceWrapperTokenToToken(activeToken.symbol)}</div>
          </div>
        )}

        {tokenAddress === WETH_ADDRESS || tokenAddress === WBNB_ADDRESS || (
          <div className="overview__token-hash">
            <div className="row-token-icon">
              {activeToken.network === 'eth' ? <TokenEth /> : <TokenBNB />}
            </div>
            <a
              className="address"
              href={`${blockExplorerUrls[tokenNetwork]}/token/${tokenAddress}`}
              target="_blank"
              rel="noopener noreferrer">
              {getShortAccount(tokenAddress)}
            </a>
            <CopyToClipboard className="icon-row copy">{tokenAddress}</CopyToClipboard>
            <BlockExplorerIcon className="icon-explorer" />
          </div>
        )}
      </div>
    )
  }

  return (
    props.isOpenOverview && (
      <section className="overview">
        {isLoading && <AnimatedMushroom />}
        {coingeckoData !== undefined && (
          <React.Fragment>
            {props.onCloseOverview && (
              <div className="close-modal" onClick={props.onCloseOverview}>
                <IconClose />
              </div>
            )}
            {renderOverviewHeader()}
            <OverviewMarketData
              activeToken={activeToken}
              coingeckoData={coingeckoData}
              isMobile={isMobile}
            />

            {homepageUrls.length !== 0 && (
              <div className="overview__contacts">
                <div className="attributes">
                  <div className="attributes-entry">
                    <strong className="attributes-entry__title">Website</strong>
                    <div className="attributes-entry__body">
                      <div className="row row--gap-xs">
                        {homepageUrls.map((url) => {
                          if (url === '') {
                            return null
                          }

                          return (
                            <div className="cell--auto">
                              <a
                                className="button button--url"
                                key={url}
                                href={url}
                                target="_blank"
                                rel="noopener noreferrer">
                                {hostNameStr(url)}
                              </a>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {renderSocialNetworks()}
            {!isMobile && (
              <div className="overview__footer">
                <button
                  className="overview__button button button--md button--main"
                  onClick={props.onCloseOverview}>
                  Close
                </button>
              </div>
            )}
          </React.Fragment>
        )}
      </section>
    )
  )
}
