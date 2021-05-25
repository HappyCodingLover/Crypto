import React, { useEffect, useState } from 'react'
import { numberWithCommas, financialFormat, isTitleNaN } from '../utils'

export default function Slide(props) {
  const [slide, setSlide] = useState(false)

  const [slideOut, setSlideOut] = useState('')
  const [slideIn, setSlideIn] = useState('')

  useEffect(() => {
    setSlideOut('slideOut')
    setSlideIn('slideIn')
    setSlide(false)
    const interval = setTimeout(() => {
      setSlide(true)
    }, 700)
    return () => clearTimeout(interval)
  }, [props.value])

  useEffect(() => {
    if (slide) {
      const interval = setTimeout(() => {
        setSlideOut('')
        setSlideIn('')
      }, 700)
      return () => clearTimeout(interval)
    }
  }, [slide])

  return (
    <React.Fragment>
      <div className={`slide ${props.className}`}>
        <div
          className={`current-value ${slideIn}`}
          title={isTitleNaN(numberWithCommas(props.previousValue))}>
          {slide ? financialFormat(props.previousValue) : financialFormat(props.value)}
        </div>
        <div
          className={`previous-value ${slideOut}`}
          title={isTitleNaN(numberWithCommas(props.value))}>
          {slide ? financialFormat(props.value) : financialFormat(props.previousValue)}
        </div>
      </div>
    </React.Fragment>
  )
}
