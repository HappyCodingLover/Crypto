import React, { useState } from 'react'

import DashboardMobile from '../Dashboard/DashboardMobile'
import ProviderMenu from '../ProviderMenu'
import Settings from '../Settings'
import HeaderMobile from '../Header/HeaderMobile'
import { appGitVersion } from '../../config/settings'
import { ContentProps } from './Content'

export const version = `Beta ${appGitVersion}`

const ContentMobile = (props: ContentProps) => {
  const [isSettingsOpen, setSettingsOpen] = useState(false)
  const { isOpenProviderMenu, closeProviderMenu, openProviderMenu, setLoading } = props

  const onClose = () => {
    if (isOpenProviderMenu) {
      closeProviderMenu()
    }

    if (isSettingsOpen) {
      setSettingsOpen(false)
    }
  }

  return (
    <div className="app app--mobile">
      <div className="app__header">
        <HeaderMobile
          isInDashboard={!isOpenProviderMenu && !isSettingsOpen}
          onOpenSettings={() => setSettingsOpen(true)}
          openProviderMenu={openProviderMenu}
          onClose={onClose}
          version={isSettingsOpen || isOpenProviderMenu ? version : undefined}
          isOpenProviderMenu={isOpenProviderMenu}
          isSettingsOpen={isSettingsOpen}
        />
      </div>
      <div className="app__body">
        {isSettingsOpen && (
          <div className="main-screen">
            <Settings isOpenSettings={true} isMobile={true} />
          </div>
        )}
        {isOpenProviderMenu && <ProviderMenu closeProviderMenu={closeProviderMenu} />}
        {!isOpenProviderMenu && !isSettingsOpen && (
          <DashboardMobile openProviderMenu={openProviderMenu} setLoading={setLoading} />
        )}
      </div>
    </div>
  )
}

export default ContentMobile
