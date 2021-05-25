import React from 'react'
import { useSelector } from 'react-redux'
import TokenRowMobile from './TokenRowMobile'
import TokenRowDesktop from './TokenRowDesktop'
import { Token } from '..'

interface TokenListProps {
  searchHide: () => void
  optionDropdown: string
  tokens: Token[]
}

const TokenList = (props: TokenListProps) => {
  const isMobile = useSelector((state: any) => state.isMobile)
  const renderTokens = (tokens: Token[]) => {
    return tokens.map((token) =>
      isMobile ? (
        <TokenRowMobile
          token={token}
          key={token.id}
          searchHide={props.searchHide}
          optionDropdown={props.optionDropdown}
        />
      ) : (
        <TokenRowDesktop token={token} key={token.id} searchHide={props.searchHide} />
      )
    )
  }

  return (
    <React.Fragment>
      <tbody className="dropdown-search__tbody">{renderTokens(props.tokens)}</tbody>
    </React.Fragment>
  )
}

export default TokenList
