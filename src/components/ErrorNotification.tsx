import React from 'react'
import { useSelector } from 'react-redux'

export default function ErrorNotification({ errorMessage }: { errorMessage: string }) {
  const { isMobile } = useSelector((state: any) => state)

  return <div className={`error-box ${!isMobile ? 'desktop' : ''} `}>{errorMessage}</div>
}
