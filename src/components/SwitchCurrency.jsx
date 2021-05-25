import React, { Component } from 'react'
import { connect } from 'react-redux'
import { setCurrency, setTokenPriceUSD } from '../actions'
import { WETH_ADDRESS, WBNB_ADDRESS } from '../config/tokens'
import { getTokenPriceInUsd } from '../services/tokenService'

class SwitchCurrency extends Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  setCurrency = (event) => {
    let current = event.currentTarget
    let currency = current.dataset.currency
    return this.props.setCurrency(currency)
  }

  componentDidMount() {
    this.props.setCurrency('USD')
    this.setCurrentTokenPriceUsd()
  }

  setCurrentTokenPriceUsd = async () => {
    const ethPrice = await getTokenPriceInUsd(WETH_ADDRESS, 'eth')
    const bnbPrice = await getTokenPriceInUsd(WBNB_ADDRESS, 'bnb')
    this.props.setTokenPriceUSD({ ethPrice: ethPrice, bnbPrice: bnbPrice })
  }

  render() {
    return (
      <div
        className={`switch-currency ${this.props.currency && this.props.currency.toLowerCase()}`}>
        <button className="active" onClick={this.setCurrency} data-currency="USD">
          USD
        </button>
        <button onClick={this.setCurrency} data-currency="ETH">
          ETH
        </button>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    currency: state.currency,
    isMobile: state.isMobile,
  }
}

const mapDispatchToProps = {
  setCurrency,
  setTokenPriceUSD,
}

export default connect(mapStateToProps, mapDispatchToProps)(SwitchCurrency)
