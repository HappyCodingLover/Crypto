import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

import TokensFormRow from './TokensFormRow'
import { getExchangeableTokens } from '../services/tokenService'

export default function TokensFormList(props) {
  const activeToken = useSelector((state) => state.currentToken)
  const tokenNetwork = activeToken.network

  const [tokens, setTokens] = useState([])

  useEffect(() => {
    getTokens()
  }, [])

  const getTokens = async () => {
    await getExchangeableTokens(props.searchSymbol, tokenNetwork).then((tokens) =>
      setTokens(tokens)
    )
  }

  useEffect(() => {
    getTokens()
  }, [props.searchSymbol])

  const renderTokens = (tokens) => {
    if (tokens && tokens.length > 0) {
      return tokens.map((token) =>
        token.id !== activeToken.id ? (
          <TokensFormRow
            token={token}
            key={token.id}
            setToken={props.setToken}
            setIsShowDown={props.setIsShowDown}
          />
        ) : null
      )
    } else {
      return null
    }
  }

  return (
    <React.Fragment>
      <div className="dropdown-search-tbody">{renderTokens(tokens)}</div>
    </React.Fragment>
  )
}
