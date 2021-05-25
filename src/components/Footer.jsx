import React from 'react'
import { appGitVersion } from '../config/settings'

export default function Footer(props) {
  if (props.isMobile) {
    return null
  }

  return (
    <div className="footer">
      {/*<div className="left-part">
        <span>© 2021 dex.guru</span>
        <span>Version Beta {appGitVersion}</span>
      </div>
      <div className="right-part">
        <a href="https://blog.dex.guru" target="_blank" rel="noopener noreferrer">
          Blog
        </a>
        <a href="https://docs.dex.guru" target="_blank" rel="noopener noreferrer">
          Gitbook
        </a>
        <a href="https://twitter.com/dexguru" target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
        <a href="https://discord.gg/dPW8fzwzz9" target="_blank" rel="noopener noreferrer">
          Discord
        </a>
        <a
          href="https://docs.dex.guru/legal/terms-of-service"
          target="_blank"
          rel="noopener noreferrer">
          Terms of Service
        </a>
      </div>*/}
    </div>
  )
}
