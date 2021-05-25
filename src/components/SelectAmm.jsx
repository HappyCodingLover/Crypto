import React from 'react'
import Select from 'react-select'
import Uniswap from '../images/icons/amm/uniswap.svg'
import SushiSwap from '../images/icons/amm/sushiswap.svg'
import Pancakeswap from '../images/icons/amm/pancakeswap.svg'

export default function SelectComponent({ onChange, selectedAmm }) {
  const optionsAmm = [
    {
      value: 'uniswap',
      label: (
        <React.Fragment>
          <Uniswap />
          <span>Uniswap</span>
        </React.Fragment>
      ),
    },
    {
      value: 'sushiswap',
      label: (
        <React.Fragment>
          <SushiSwap />
          <span>Sushiswap</span>
        </React.Fragment>
      ),
    },
    {
      value: 'pancakeswap',
      label: (
        <React.Fragment>
          <Pancakeswap />
          <span>Pancakeswap</span>
        </React.Fragment>
      ),
    },
  ]

  const customStyles = {
    control: (styles, { menuIsOpen }) => ({
      ...styles,
      backgroundColor: '#181d23',
      outline: 'none',
      border: 'none',
      boxShadow: 'none',
      borderRadius: menuIsOpen ? '6px 6px 0 0' : '6px',
    }),
    option: (styles) => ({
      ...styles,
      backgroundColor: 'transparent',
      cursor: 'pointer',
      padding: '6px 12px',
      margin: '0',
      display: 'flex',
      alignItems: 'center',
      fontSize: '12px',
      outline: 'none',
      span: {
        marginLeft: '8px',
      },
      ':hover': {
        backgroundColor: '#232a32',
        color: '#afa5fb',
      },
      ':active': {
        backgroundColor: '#232a32',
        color: '#afa5fb',
      },
      ':last-child': {
        borderRadius: '0 0 6px 6px',
      },
    }),
    menu: (styles, { menuIsOpen }) => ({
      ...styles,
      zIndex: '3',
      margin: '0',
      backgroundColor: '#181d23',
      borderRadius: menuIsOpen ? '6px 6px 0 0' : '0 0 6px 6px',
    }),
    menuList: (styles) => ({
      ...styles,
      padding: '0',
    }),
    placeholder: (styles) => ({
      ...styles,
      fontSize: '12px',
      color: '#ffffff',
    }),
    singleValue: (styles) => ({
      ...styles,
      display: 'flex',
      alignItems: 'center',
      color: '#ffffff',
      margin: '0 0 0 4px',
      fontSize: '12px',
      fontWeight: '500',
      span: {
        marginLeft: '8px',
      },
    }),
    dropdownIndicator: (base, { selectProps }) => ({
      ...base,
      svg: {
        transform: selectProps.menuIsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
      },
      path: {
        fill: selectProps.menuIsOpen ? '#9488F0' : '#ffffff',
      },
    }),
    indicatorsContainer: (styles) => ({
      ...styles,
      color: '#ffffff',
    }),
    indicatorSeparator: (styles) => ({
      ...styles,
      backgroundColor: 'transparent',
    }),
    input: (styles) => ({
      ...styles,
      fontSize: '12px',
      color: '#ffffff',
    }),
  }

  const valueAmm = optionsAmm.filter((item) => {
    return item.value === selectedAmm
  })

  return (
    <Select
      options={optionsAmm}
      className="custom-select"
      classNamePrefix="custom-select"
      placeholder="Select an AMM"
      onChange={onChange}
      value={valueAmm}
      styles={customStyles}
    />
  )
}
