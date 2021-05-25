import React from 'react'
import Turtle from '../images/icons/emoji/turtle.svg'
import Shark from '../images/icons/emoji/shark.svg'
import Bot from '../images/icons/emoji/bot.svg'
import Whale from '../images/icons/emoji/whale.svg'

export default function TraderCategory(props) {
  const category = props.walletCategory

  const getCategory = () => {
    var emoji
    switch (category) {
      case 'Medium':
        emoji = (
          <Shark
            className="dolphin"
            data-tip="Active Trader with $100k-$500k of a trading volume last 30 days"
            data-for="sidebar-trader-tooltip"
          />
        )
        break
      case 'Casual':
        emoji = (
          <Turtle
            className="turtle"
            data-tip="Casual Trader with $10k-$100k of a trading volume last 30 days"
            data-for="sidebar-trader-tooltip"
          />
        )
        break
      case 'Heavy':
        emoji = (
          <Whale
            className="elephant"
            data-tip="Heavy Trader with $500k+ of a trading volume last 30 days"
            data-for="sidebar-trader-tooltip"
          />
        )
        break
      case 'Bot':
        emoji = (
          <Bot
            className="bot"
            data-tip="Trader with 1000+ TXs in last 30 days. Most likely bot."
            data-for="sidebar-trader-tooltip"
          />
        )
        break
      default:
        emoji = <div></div>
        break
    }
    return emoji
  }

  return <React.Fragment>{getCategory()}</React.Fragment>
}
