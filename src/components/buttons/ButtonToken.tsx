import React from 'react'
import { getTokenAddressFromId } from '../../utils'
import IconTokenComponent from '../IconTokenComponent'
import { useSelector } from 'react-redux'
import { Token, TokenIcon } from '../../index'
import { State } from '../../reducers'
import { getIconToken } from '../../services/iconService'

interface ButtonTokenProps {
  tokenFrom?: Token
  tokenTo?: Token
  id: string
  network: string
  tokenChoose: (event: any) => void
  symbol: string
}

export default function ButtonToken(props: ButtonTokenProps) {
  const activeTradeType = useSelector((state: State) => state.activeTradeType)
  const [IconToken, setIconToken] = React.useState<TokenIcon>(null)

  React.useEffect(() => {
    getTokenIcons()
  }, [props])

  const getTokenIcons = async () => {
    const IconToken = await getIconToken(getTokenAddressFromId(props.id), props.network)
    setIconToken(IconToken)
  }

  if (!props.id || !(activeTradeType === 'Buy' ? props.tokenTo?.id : props.tokenFrom?.id)) {
    return null
  }

  return (
    <button data-id={`${props.id}`} onClick={props.tokenChoose}>
      <div className="token">
        <span className={`icon token-border-network ${props.network}`}>
          <div className="token-border small">
            <IconTokenComponent IconToken={IconToken} symbol={props.symbol} />
          </div>
        </span>
        <span className="name text-overflow">{props.symbol}</span>
      </div>
    </button>
  )
}
