import React, { useState, useEffect } from 'react'
import classNames from 'classnames'
import { useDispatch, useSelector } from 'react-redux'
import IconClose from '../images/icons/close.svg'
import Discord from '../images/icons/discord.svg'
import Twitter from '../images/icons/twitter.svg'
import Telegram from '../images/icons/telegram.svg'
import GasFeeOptionsSettings from './GasFeeOptions/GasFeeOptionsSettings'
import { updateSettings } from '../actions'
import LimitsOptionsMobile from './LimitsOptions/LimitsOptionsMobile'

interface SettingsProps {
  closeSettings?: () => void
  isOpenSettings: boolean
  isMobile: boolean
  version?: string
}

const Settings = (props: SettingsProps) => {
  const reduxDispatch = useDispatch()
  const storedSettings = useSelector((store: any) => store.settings)
  const [isNotify, setNotify] = useState(true)

  useEffect(() => {
    setNotify(storedSettings.pushNotifications)
  }, [storedSettings])

  const changeNotify = () => {
    setNotify(!isNotify)
    updateSettingsHandler({ pushNotifications: !isNotify })
  }

  const updateSettingsHandler = (value: any) => {
    reduxDispatch(updateSettings({ ...storedSettings, ...value }))
  }

  if (!props.isOpenSettings) {
    return null
  }

  const links = (
    <div className="links-wrapper">
      {props.isMobile && (
        <>
          <a href="https://blog.dex.guru" target="_blank" rel="noopener noreferrer">
            Blog
          </a>
          <a href="https://docs.dex.guru" target="_blank" rel="noopener noreferrer">
            Gitbook
          </a>
        </>
      )}
      <a
        href="https://docs.dex.guru/legal/privacy-policy"
        target="_blank"
        rel="noopener noreferrer">
        Privacy
      </a>
      <a
        href="https://docs.dex.guru/legal/terms-of-service"
        target="_blank"
        rel="noopener noreferrer">
        Terms of service
      </a>
    </div>
  )

  return (
    <div className={classNames('settings-container', { mobile: props.isMobile })}>
      <div className="settings">
        {!props.isMobile && props.closeSettings && (
          <div className="close-modal" onClick={props.closeSettings}>
            <IconClose />
          </div>
        )}
        <div className="title-part">
          <div className="settings-title">Settings</div>
          {!props.isMobile && <div className="version">{props.version}</div>}
        </div>
        <div className="modal-settings-body">
          <div className="body-data">
            {props.isMobile && (
              <React.Fragment>
                <LimitsOptionsMobile {...storedSettings} updateSettings={updateSettingsHandler} />
                <GasFeeOptionsSettings {...storedSettings} updateSettings={updateSettingsHandler} />
              </React.Fragment>
            )}

            <div className="light-block">
              <div className="body-data-row">
                <div className="main-data">
                  <div className="left-label">
                    <div className="option-label">Push Notifications</div>
                    <div className="under-label">
                      Stay up-to-date with your favorites when market moves
                    </div>
                  </div>
                  <label className="switch">
                    <input type="checkbox" checked={isNotify} onChange={changeNotify} />
                    <span className="slider round" />
                  </label>
                </div>
              </div>
              <div className="body-data-row">
                <div className="main-data">
                  <div className="left-label">
                    <div className="option-label">Price Changes Threshold</div>
                    <div className="under-label">When market moves, +/-</div>
                  </div>
                  <div className="percent-inputs">
                    <input
                      type="text"
                      value={storedSettings.priceChangesThreshold}
                      onChange={({ target }) => {
                        updateSettingsHandler({ priceChangesThreshold: target.value })
                      }}
                      placeholder="20 % "
                    />
                  </div>
                </div>
              </div>
              <div className="body-data-row">
                <div className="main-data">
                  <div className="left-label">
                    <div className="option-label">Liquidity Changes Threshold</div>
                    <div className="under-label">When pair’s liquidity changes, +/-</div>
                  </div>
                  <div className="percent-inputs">
                    <input
                      type="text"
                      placeholder="20 %"
                      value={storedSettings.liquidityChangesThreshold}
                      onChange={({ target }) => {
                        updateSettingsHandler({ liquidityChangesThreshold: target.value })
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="bottom-part-settings">
              <div className="body-data-row">
                <div className="main-data">
                  <div className="left-label">
                    <div className="option-label">Join Our Community</div>
                    <div className="buttons-community">
                      <a
                        href="https://discord.gg/dPW8fzwzz9"
                        target="_blank"
                        rel="noopener noreferrer">
                        <span className="icon">
                          <Discord />
                        </span>
                        <span>Discord</span>
                      </a>
                      <a
                        href="https://twitter.com/dexguru"
                        target="_blank"
                        rel="noopener noreferrer">
                        <span className="icon">
                          <Twitter />
                        </span>
                        <span>Twitter</span>
                      </a>
                      <a href="https://t.me/dexguru" target="_blank" rel="noopener noreferrer">
                        <span className="icon">
                          <Telegram />
                        </span>
                        <span>Telegram</span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {!props.isMobile && (
                <div className="body-data-row">
                  <div className="main-data">
                    <div className="left-label">
                      <div className="option-label">Legal</div>
                      {links}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {!props.isMobile && (
          <div className="modal-settings-footer">
            <button className="button button-green" onClick={props.closeSettings}>
              Close
            </button>
          </div>
        )}
        {props.isMobile && <div className="modal-settings-mobile-footer">{links}</div>}
      </div>
    </div>
  )
}

export default Settings
