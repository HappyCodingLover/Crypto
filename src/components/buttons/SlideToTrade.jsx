import React, { Component } from 'react'
import classNames from 'classnames'

// This could be moved to redux if needed
const isTouchDevice = 'ontouchstart' in document.documentElement

const draggerMostLeft = 22
const draggerMostRight = 28
const containerOffset = 50

export class SlideToTrade extends Component {
  constructor(props) {
    super(props)
    this.state = {
      left: draggerMostLeft,
    }

    this.slider = React.createRef()
    this.container = React.createRef()
  }

  componentDidMount() {
    if (isTouchDevice) {
      document.addEventListener('touchmove', this.onDrag)
      document.addEventListener('touchend', this.stopDrag)
    } else {
      document.addEventListener('mousemove', this.onDrag)
      document.addEventListener('mouseup', this.stopDrag)
    }
    this.containerWidth = this.container.current.clientWidth - containerOffset
  }

  componentDidUpdate() {
    if (this.containerWidth < 0) {
      this.containerWidth = this.container.current.clientWidth - containerOffset
    }
  }

  onDrag = (e) => {
    if (this.unmounted || this.state.unlocked || this.props.isDisabled) return
    if (this.isDragging) {
      if (isTouchDevice) {
        this.sliderLeft = Math.min(
          Math.max(draggerMostLeft, e.touches[0].clientX - (this.startX | 0)),
          this.containerWidth || 0
        )
      } else {
        this.sliderLeft = Math.min(
          Math.max(draggerMostLeft, e.clientX - (this.startX || 0)),
          this.containerWidth || 0
        )
      }

      this.updateSliderStyle()
    }
  }

  updateSliderStyle = () => {
    if (!this.unmounted && !this.state.unlocked) {
      const left = this.sliderLeft + draggerMostRight + 'px'
      this.setState({ left }, () => (this.slider.current.style.left = left))
    }
  }

  stopDrag = () => {
    if (this.unmounted || this.state.unlocked) return
    if (this.isDragging) {
      this.isDragging = false
      if (this.sliderLeft > this.containerWidth * 0.9) {
        this.sliderLeft = this.containerWidth
        if (this.props.onSuccess) {
          this.props.onSuccess()
          this.onSuccess()
        }
      } else {
        this.sliderLeft = draggerMostLeft
        if (this.props.onFailure) {
          this.props.onFailure()
        }
      }
      this.updateSliderStyle()
    }
  }

  startDrag = (e) => {
    if ((!this.unmounted && this.state.unlocked) || this.props.disabled) {
      return
    }

    this.isDragging = true

    if (isTouchDevice) {
      this.startX = e.touches && e.touches[0]?.clientX
    } else {
      this.startX = e.clientX
    }
  }

  onSuccess = () => {
    if (this.container.current) {
      this.container.current.style.width = this.container.current.clientWidth + 'px'
    }

    this.setState({
      unlocked: true,
    })
  }

  getText = () => {
    return `Swipe to ${this.props.tradeType}`
  }

  componentWillUnmount() {
    this.unmounted = true
  }

  render() {
    const buy = this.props.tradeType === 'Buy'
    const sell = this.props.tradeType === 'Sell'

    return (
      <div className="slide-to-trade-button">
        <div
          className={classNames('slide-to-trade-button-container', {
            _buy: buy,
            _sell: sell,
            'button-unlocked': this.state.unlocked,
            disabled: this.props.disabled,
          })}
          ref={this.container}>
          <div
            className={classNames('button-slider', { _buy: buy, _sell: sell })}
            ref={this.slider}
            onMouseDown={this.startDrag}
            style={{ background: this.props.color }}
            onTouchStart={this.startDrag}>
            <span className="button-slider-text">{this.getText()}</span>
            <span className={classNames('button-arrow', { disabled: this.props.disabled })} />
            <span className={classNames('button-dragger', { _buy: buy, _sell: sell })} />
          </div>
          <div className="button-text">
            <span>{this.getText()}</span>
          </div>
        </div>
      </div>
    )
  }
}

export default SlideToTrade
