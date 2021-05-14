import React from 'react'

const IconTokenComponent = ({ IconToken, symbol }) => {
    return IconToken instanceof String ? (
        <img className="icon-token" src={`${IconToken}`} alt={`${symbol}`} title={`${symbol}`} />
    ) : (
        <IconToken/>
    )
}

export default IconTokenComponent
