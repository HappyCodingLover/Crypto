import React from 'react'

import { getTokenAddressFromId, replaceWrapperTokenToToken } from '../utils'
import IconTokenComponent from './IconTokenComponent'
import { getIconToken } from '../services/iconService'
import { TokenIcon, Token } from '../index'
import { setQuoteToken } from '../services/tokenService'

interface TokensFormRowProps {
  token: Token
  setToken: (token: Token) => void
  setIsShowDown: (value: boolean) => void
}

function TokensFormRow(props: TokensFormRowProps) {
  const [IconToken, setIconToken] = React.useState<TokenIcon>(null)

  let token = props.token

  const selectToken = () => {
    token = { ...token, icon: IconToken }
    setQuoteToken(token)
    props.setToken(token)
    props.setIsShowDown(false)
  }

  React.useEffect(() => {
    getTokenIcons()
  }, [token])

  const getTokenIcons = async () => {
    const tokenIcon = await getIconToken(getTokenAddressFromId(token), token.network)
    setIconToken(tokenIcon)
  }

  return (
    <div className={`dropdown-search-trow `}>
      <div className="row-wrapper" onClick={selectToken}>
        {
          <div className="token-icon">
            <div className={`token-primary token-border-network ${token.network}`}>
              <div className="token-border small">
                <IconTokenComponent IconToken={IconToken} symbol={props.token.symbol} />
              </div>
            </div>
          </div>
        }
        {
          <div className="token-name">
            <span className="text-overflow" title={replaceWrapperTokenToToken(token.symbol)}>
              {replaceWrapperTokenToToken(token.symbol)}
            </span>
          </div>
        }
      </div>
    </div>
  )
}

export default TokensFormRow
