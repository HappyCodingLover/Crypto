import React from 'react'
import SpinnerIcon from '../images/animation/spinner.svg'
import { blockExplorerIcons } from '../config/settings'
import { blockExplorerUrls } from '../config/settings'
import { useSelector } from 'react-redux'
import classNames from 'classnames'
import IconClose from '../images/icons/close.svg'
import { State } from '../reducers'
import { TokenNetwork } from '../index'

let BlockExplorerIcon = null

interface SpinnerProps {
  onClose: () => void
  hashTransaction?: string
  text?: string
  network?: TokenNetwork
}

export default function Spinner(props: SpinnerProps) {
  const { isMobile } = useSelector((state: State) => state)

  if (!props.network) {
    return null
  }

  // @ts-ignore
  BlockExplorerIcon = blockExplorerIcons[props.network]
  const url = blockExplorerUrls[props.network]

  return (
    <div className={classNames('spinner-container', { mobile: isMobile })}>
      {isMobile && (
        <div className="close-modal" onClick={props.onClose}>
          <IconClose />
        </div>
      )}
      <div className={classNames('spinner-wrapper', { mobile: isMobile })}>
        <div className="spinner">
          <div className="spinner-animation">
            <SpinnerIcon />
          </div>
        </div>
        {props.text && <p className="spinner-text">{props.text}</p>}
        {props.hashTransaction && (
          <a
            href={`${url}/tx/${props.hashTransaction}`}
            className="spinner-hash"
            target="_blank"
            rel="noopener noreferrer">
            <BlockExplorerIcon />
            View on&nbsp;{props.network === 'eth' ? 'Etherscan' : 'BSCSCAN'}
          </a>
        )}
        <button className="button red" onClick={props.onClose}>
          Close
        </button>
      </div>
    </div>
  )
}
