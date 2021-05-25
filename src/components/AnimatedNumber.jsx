import React, { useEffect, useState } from 'react'
import { getShortTopNumber, numberWithCommas, isTitleNaN } from '../utils'
import { usePrevious } from '../hooks'

export default function AnimatedNumber({ value, prevValue, color, isAnimatedValue }) {
  //needed to avoid glitch;
  const prevPrevValue = usePrevious(prevValue)

  const [visible, setVisible] = useState('fadeOut')
  const [oldFadedOut, setOldFadedOut] = useState(false)
  const [newFadedIn, setNewFadedIn] = useState(false)

  useEffect(() => {
    setOldFadedOut(false)
    setNewFadedIn(false)
    setVisible('fadeOut')
    const interval = setTimeout(() => {
      setVisible('fadeIn')
      setOldFadedOut(true)
    }, 500)
    return () => clearTimeout(interval)
  }, [isAnimatedValue])

  useEffect(() => {
    if (oldFadedOut) {
      const interval = setTimeout(() => {
        setNewFadedIn(true)
      }, 500)
      return () => clearTimeout(interval)
    }
  }, [oldFadedOut])

  useEffect(() => {
    setOldFadedOut(false)
    setNewFadedIn(false)
  }, [isAnimatedValue])

  return (
    <span
      className={`number ${!oldFadedOut || newFadedIn ? '' : color} ${visible}`}
      title={isTitleNaN(
        numberWithCommas(prevPrevValue === prevValue && oldFadedOut ? value : prevValue)
      )}>
      {prevPrevValue === prevValue && oldFadedOut
        ? getShortTopNumber(value, 2)
        : getShortTopNumber(prevValue, 2)}
    </span>
  )
}
