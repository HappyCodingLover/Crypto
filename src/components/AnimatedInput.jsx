import React from 'react'

export default function AnimatedInput() {
  const randomNumbers = '9357125942'

  const renderNumbers = () => {
    let renderNumbers = []
    for (var i = 0; i < randomNumbers.length; i++) {
      renderNumbers.push(<span key={i}>{randomNumbers[i]}</span>)
    }
    return renderNumbers
  }

  return <div className="animated-input">{renderNumbers()}</div>
}
