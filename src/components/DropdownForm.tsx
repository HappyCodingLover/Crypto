import React, { ChangeEvent, useState } from 'react'
import { useSelector } from 'react-redux'
import { replaceWrapperTokenToToken } from '../utils'
import OutsideClicker from './OutsideClicker'
import TokensFormList from './TokensFormList'
import Up from '../images/icons/up.svg'
import ButtonToken from './buttons/ButtonToken'
import SimpleBar from 'simplebar-react'
import IconTokenComponent from './IconTokenComponent'
import gtmService from '../services/gtmService'
import { Token, TradeType } from '../index'
import { State } from '../reducers'
import { setQuoteTokenById } from '../services/tokenService'

interface DropdownFormProps {
  tradeType: TradeType
  setTokenFrom: (tokenFrom: Token) => void
  setTokenTo: (tokenFrom: Token) => void
  IconTokenFrom: React.ReactNode
  IconTokenTo: React.ReactNode
  tokenTo?: Token
  tokenFrom?: Token
}

const DEFAULT_FORM_DROPDOWN_TOKENS_ETH = [
  {
    name: 'ETH',
    id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2-eth',
  },
  {
    name: 'USDC',
    id: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48-eth',
  },
  {
    name: 'USDT',
    id: '0xdac17f958d2ee523a2206206994597c13d831ec7-eth',
  },
  {
    name: 'LINK',
    id: '0x514910771af9ca656af840dff83e8264ecf986ca-eth',
  },
]
const DEFAULT_FORM_DROPDOWN_TOKENS_BSC = [
  {
    name: 'BNB',
    id: '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c-bsc',
  },
  {
    name: 'BUSD',
    id: '0xe9e7cea3dedca5984780bafc599bd69add087d56-bsc',
  },
  {
    name: 'USDT',
    id: '0x55d398326f99059ff775485246999027b3197955-bsc',
  },
  {
    name: 'BTCB',
    id: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c-bsc',
  },
]

const DEFAULT_FORM_DROPDOWN_TOKENS = {
  eth: DEFAULT_FORM_DROPDOWN_TOKENS_ETH,
  bsc: DEFAULT_FORM_DROPDOWN_TOKENS_BSC,
}

function DropdownForm(props: DropdownFormProps) {
  const { currentToken: activeToken, isMobile } = useSelector((state: State) => state)

  const tokenNetwork = activeToken.network
  const [isShowDown, setIsShowDown] = useState(false)
  const [focusInput, setFocusInput] = useState(false)

  const [searchSymbol, setSearchSymbol] = useState('')

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchSymbol(e.target.value.toUpperCase())
  }

  const tokenChoose = async (event: any) => {
    const id = event.target.closest('button')?.dataset?.id

    if (!id) {
      return null
    }
    const quoteToken = await setQuoteTokenById(id)

    if (!quoteToken) {
      return null
    }

    if (isMobile) {
      // this screen is like ModalVerify on Mobile, need to send Add To Cart action
      gtmService.v3.addToCart(activeToken, quoteToken)
      gtmService.v4.addToCart(activeToken, quoteToken)
    }
    if (props.tradeType === 'Buy') {
      props.setTokenFrom(quoteToken)
    } else {
      props.setTokenTo(quoteToken)
    }
    setIsShowDown(false)
    setSearchSymbol('')
  }

  const showDropdown = () => {
    if (isShowDown) {
      setIsShowDown(false)
      setSearchSymbol('')
    } else {
      setIsShowDown(true)
    }
  }

  const closeDropdown = () => {
    setIsShowDown(false)
    setSearchSymbol('')
  }

  const onFocus = () => {
    setFocusInput(true)
  }

  const onBlur = () => {
    setFocusInput(false)
  }

  const IconToken = props.tradeType === 'Buy' ? props.IconTokenFrom : props.IconTokenTo
  const iconAlt = props.tradeType === 'Buy' ? props.tokenFrom?.symbol : props.tokenTo?.symbol

  let defaultTokens = DEFAULT_FORM_DROPDOWN_TOKENS[tokenNetwork] || []
  if (isMobile) defaultTokens = defaultTokens.slice(0, 3)

  return (
    <OutsideClicker clickHide={closeDropdown}>
      <React.Fragment>
        <div className={`${isShowDown ? 'open-drop' : ''} select-buttons`} onClick={showDropdown}>
          <div className="token">
            <span
              className={`icon token-border-network ${
                props.tradeType === 'Buy' ? props.tokenFrom?.network : props.tokenTo?.network
              }`}>
              <div className="token-border small">
                <IconTokenComponent IconToken={IconToken} symbol={iconAlt} />
              </div>
            </span>
            <span
              className="name text-overflow"
              title={replaceWrapperTokenToToken(
                (props.tradeType === 'Buy' ? props.tokenFrom : props.tokenTo)?.symbol
              )}>
              {replaceWrapperTokenToToken(
                (props.tradeType === 'Buy' ? props.tokenFrom : props.tokenTo)?.symbol
              )}
            </span>
            <span className={`up ${isShowDown ? 'up' : 'down'}`}>
              <Up />
            </span>
          </div>
        </div>
        {isShowDown && (
          <div className="drop-select">
            <div className="title-dropdown-tokens">Select a token</div>
            <div className="buttons-group">
              {defaultTokens
                .filter((token: { id: string }) => activeToken.id !== token.id)
                .map((token: { id: string; name: string }) => (
                  <ButtonToken
                    id={token.id}
                    tokenFrom={props.tokenFrom}
                    tokenTo={props.tokenTo}
                    tokenChoose={tokenChoose}
                    symbol={token.name}
                    key={token.name}
                    network={tokenNetwork}
                  />
                ))}
            </div>
            <div className={`input-wraper-search ${focusInput ? 'input-rainbow' : ''}`}>
              <input
                className="token-search"
                placeholder="Search token ticker"
                onFocus={onFocus}
                onBlur={onBlur}
                onChange={onChange}
                value={searchSymbol}
              />
            </div>
            <div className="wrapper-for-search-result">
              <SimpleBar
                style={{
                  maxHeight: 90,
                }}
                forceVisible="y">
                <div className="tokens-list">
                  <TokensFormList
                    searchSymbol={searchSymbol}
                    setToken={props.tradeType === 'Buy' ? props.setTokenFrom : props.setTokenTo}
                    setIsShowDown={setIsShowDown}
                  />
                </div>
              </SimpleBar>
            </div>
          </div>
        )}
      </React.Fragment>
    </OutsideClicker>
  )
}

export default DropdownForm
