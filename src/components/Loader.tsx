import React from 'react'
import Guru from   '../images/animation/guru.svg'

export default function Loader({ inner }: { inner?: boolean }) {
  return (
    <React.Fragment>
      <div className={`loader-guru ${inner ? 'loader-guru--inner' : ''}`}>
        <div className="loader-guru__rainbow">
          <div className="loader-rainbow">
            <div className="loader-rainbow__line" />
            <div className="loader-rainbow__line" />
            <div className="loader-rainbow__line" />
            <div className="loader-rainbow__line" />
            <div className="loader-rainbow__line" />
          </div>
        </div>
        <div className="loader-guru__avatar">
          <Guru />
        </div>
      </div>
    </React.Fragment>
  )
}
