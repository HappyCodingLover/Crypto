import Clipboard from 'clipboard'
import React, { useEffect } from 'react'
import ReactTooltip from 'react-tooltip'
import IconCopy from '../images/icons/copy.svg'

const CopyToClipboard = (props) => {
  const copyEl = React.useRef(null)
  let clipboard = undefined

  useEffect(() => {
    if (copyEl.current !== null && !clipboard) {
      clipboard = new Clipboard(copyEl.current)
      clipboard.on('success', (e) => {
        if (!copyEl.current) {
          return
        }
        copyEl.current.dataset.tip = 'Copied!'
        ReactTooltip.show(copyEl.current)
        window.setTimeout(() => ReactTooltip.hide(copyEl.current), 1000)
        e.clearSelection()
      })
      clipboard.on('error', () => {
        if (!copyEl.current) {
          return
        }
        copyEl.current.dataset.tip = 'Copy failed!'
        ReactTooltip.show(copyEl.current)
        window.setTimeout(() => ReactTooltip.hide(copyEl.current), 1000)
      })
    }
    return () => {
      if (clipboard) {
        clipboard.destroy()
      }
    }
  })

  return (
    <React.Fragment>
      <span
        className={props.className || ''}
        ref={copyEl}
        data-clipboard-text={props.children}
        data-for={props.children}>
        <IconCopy />
      </span>
      <ReactTooltip
        className="tooltip__copy"
        id={props.children}
        event="fakeEvent"
        textColor="#fff"
        backgroundColor="#6d7986"
      />
    </React.Fragment>
  )
}

export default React.memo(CopyToClipboard)
