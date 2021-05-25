import React from 'react'

import ContentMobile from './ContentMobile'
import ContentDesktop from './ContentDesktop'

export interface ContentProps {
  isMobile: boolean
  isOpenProviderMenu: boolean
  closeProviderMenu: () => void
  setLoading: (value: boolean) => void
  openProviderMenu: () => void
}

const Content = (props: ContentProps) => {
  if (props.isMobile) {
    return <ContentMobile {...props} />
  }

  return <ContentDesktop {...props} />
}

export default Content
