import React, { useState } from 'react'
import Modal from 'react-modal'
import { useSelector, useDispatch } from 'react-redux'
import HeaderDesktop from '../Header/HeaderDesktop'
import DashboardDesktop from '../Dashboard/DashboardDesktop'
import ModalVerify from '../ModalVerify'
import ProviderMenu from '../ProviderMenu.jsx'
import Settings from '../Settings'
import Overview from '../Overview.jsx'
import { appGitVersion } from '../../config/settings'
import { ContentProps } from './Content'
import gtmService from '../../services/gtmService'
import { TradeType, Token } from '../..'
import * as actions from '../../actions'
import { State } from '../../reducers'

export const version = `Beta ${appGitVersion}`

function ContentDesktop(props: ContentProps) {
  const currentToken = useSelector((state: State) => state.currentToken)
  const quoteToken = useSelector((state: State) => state.quoteToken)
  const reduxDispatch = useDispatch()

  const [isOpenVerifyForm, setIsOpenVerifyForm] = useState<boolean>(false)
  const [isOpenSettings, setIsOpenSettings] = useState<boolean>(false)
  const [isOpenOverview, setIsOpenOverview] = useState<boolean>(false)
  const [tokenFrom, setTokenFrom] = useState<Token | undefined>(undefined)
  const [tokenTo, setTokenTo] = useState<Token | undefined>(undefined)

  const openVerifyForm = (tokenFrom: Token, tokenTo: Token, tradeType: TradeType) => {
    reduxDispatch(actions.activeTradeType(tradeType))

    // Send Add To Cart event to GTM
    gtmService.v3.addToCart(currentToken, quoteToken)
    gtmService.v4.addToCart(currentToken, quoteToken)

    setTokenFrom(tokenFrom)
    setTokenTo(tokenTo)
    setIsOpenVerifyForm(true)
  }

  const closeVerifyForm = () => {
    setIsOpenVerifyForm(false)
  }

  const openSettings = () => {
    setIsOpenSettings(true)
  }

  const closeSettings = () => {
    setIsOpenSettings(false)
  }

  const onOpenOverview = () => {
    setIsOpenOverview(true)
  }

  const onCloseOverview = () => {
    setIsOpenOverview(false)
  }

  React.useEffect(() => {
    Modal.setAppElement('body')
  }, [])

  return (
    <React.Fragment>
      <div className="app app--desktop">
        <div className="app__header">
          <HeaderDesktop
            openProviderMenu={props.openProviderMenu}
            openSettings={openSettings}
            closeSettings={closeSettings}
            onOpenOverview={onOpenOverview}
          />
        </div>
        <div className="app__body">
          <DashboardDesktop
            openProviderMenu={props.openProviderMenu}
            openVerify={openVerifyForm}
            setLoading={props.setLoading}
          />
        </div>
      </div>
      <Modal
        isOpen={isOpenVerifyForm}
        onRequestClose={closeVerifyForm}
        overlayClassName="overlay-modal"
        className="content-modal">
        <ModalVerify closeVerify={closeVerifyForm} tokenFrom={tokenFrom} tokenTo={tokenTo} />
      </Modal>
      <Modal
        isOpen={props.isOpenProviderMenu}
        onRequestClose={props.closeProviderMenu}
        overlayClassName="overlay-modal"
        className="content-modal">
        <ProviderMenu closeProviderMenu={props.closeProviderMenu} />
      </Modal>
      <Modal
        isOpen={isOpenSettings}
        onRequestClose={closeSettings}
        overlayClassName="overlay-modal"
        className="content-modal">
        <Settings
          closeSettings={closeSettings}
          isOpenSettings={isOpenSettings}
          isMobile={false}
          version={version}
        />
      </Modal>
      <Modal
        isOpen={isOpenOverview}
        onRequestClose={onCloseOverview}
        overlayClassName="overlay-modal"
        className="content-modal">
        <Overview onCloseOverview={onCloseOverview} isOpenOverview={isOpenOverview} />
      </Modal>
    </React.Fragment>
  )
}

export default ContentDesktop
