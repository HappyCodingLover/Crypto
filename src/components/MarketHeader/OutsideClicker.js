import React, { Component } from 'react'
import PropTypes from 'prop-types'

export default class OutsideClicker extends Component {
    constructor(props) {
        super(props)

        this.setWrapperRef = this.setWrapperRef.bind(this)
        this.handleClickOutside = this.handleClickOutside.bind(this)
    }

    componentDidMount() {
        document.addEventListener('mousedown', this.handleClickOutside)
    }

    componentWillUnmount() {
        document.removeEventListener('mousedown', this.handleClickOutside)
    }

    setWrapperRef(node) {
        this.wrapperRef = node
    }

    handleClickOutside(event) {
        if (this.wrapperRef && !this.wrapperRef.contains(event.target)) {
            this.props.clickHide()
        }
    }

    render() {
        return (
            <div ref={this.setWrapperRef} className="click-wrapper">
                {this.props.children}
            </div>
        )
    }
}

OutsideClicker.propTypes = {
    children: PropTypes.element.isRequired,
}
