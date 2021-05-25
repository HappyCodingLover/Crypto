import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useHistory, useParams } from 'react-router-dom'
import { useWeb3React } from '@web3-react/core'
import { financialFormat, replaceWrapperTokenToToken } from '../utils'
import Content from '../components/Content/Content'
import Loader from '../components/Loader'
import { supportedChainIds } from '../connectors'
import { initCurrentToken } from '../services/tokenService'

const Web3Wrapper = () => {
  const history = useHistory()
  const params: any = useParams()
  const { account: Web3Account, chainId: Web3ChainId } = useWeb3React()

  const [isOpenProviderMenu, setStateProviderMenu] = useState(false)
  const [isReadyTradingViewLoading, setLoadingTradingView] = useState(true)
  const [isSupportedChainId, setIsSupportedChainId] = useState(true)

  const { currentToken, isMobile, tokenLoading: isLoading } = useSelector((state: any) => state)

  const openProviderMenu = () => {
    setStateProviderMenu(true)
  }

  const closeProviderMenu = () => {
    setStateProviderMenu(false)
  }

  useEffect(() => {
    setIsSupportedChainId(!(Web3ChainId !== undefined && !supportedChainIds.includes(Web3ChainId)))
  }, [Web3ChainId])

  useEffect(() => {
    if (!currentToken?.id) {
      initCurrentToken({ tokenIdWithNetwork: params.token, Web3Account })
    }

    if (currentToken?.id) {
      const { priceUSD, symbol } = currentToken
      document.title = `$${financialFormat(priceUSD)} ${replaceWrapperTokenToToken(
        symbol
      )} | DexGuru `

      if (params.token !== currentToken.id) {
        history.push(`/token/${currentToken.id}`)
      }
    }

    // dont find any token
    if (currentToken === null) {
      history.push('/')
    }
  }, [currentToken.id])

  // do not load any content if we don't know if it's mobile or desktop
  if (isMobile === null) {
    return null
  }

  return (
    <>
      {/*{!isMobile && (isLoading || isReadyTradingViewLoading) && <Loader />}*/}

      {!isLoading && (
        <Content
          openProviderMenu={openProviderMenu}
          closeProviderMenu={closeProviderMenu}
          isOpenProviderMenu={isOpenProviderMenu}
          setLoading={setLoadingTradingView}
          isMobile={isMobile}
        />
      )}

      {!isSupportedChainId && (
        <div className="wrong-network">
          <Loader />
          <div>Wrong Network</div>
        </div>
      )}
    </>
  )
}

export default Web3Wrapper
