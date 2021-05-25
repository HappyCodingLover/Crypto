import React, { useEffect, useState } from 'react'
import   Unknown from '../images/icons/tokens/unknown.svg'

const IconTokenComponent = ({
  IconToken,
  symbol,
  className,
}: {
  IconToken: any
  symbol?: string
  className?: string
}) => {
  const [hasError, setHasError] = useState<boolean>(false)

  useEffect(() => {
    setHasError(false)
  }, [IconToken])

  const handleImageError = () => {
    setHasError(true)
  }

  if (!IconToken || hasError) {
    return <Unknown/>
  }

  return IconToken instanceof String ? (
    <img
      className={`icon-token ${className}`}
      onError={handleImageError}
      src={`${IconToken}`}
      alt={`${symbol}`}
      title={`${symbol}`}
    />
  ) : (
    null //<IconToken />
  );
  return null;
}

export default IconTokenComponent
