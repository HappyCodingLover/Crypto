import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useDebounce } from 'use-debounce'
import Close from '../images/icons/close.svg'
import { DEBOUNCE_INPUT } from '../config/settings'
import { getListTokensBySymbol } from '../services/tokenService'
import classNames from 'classnames'

function InputTokenName(props) {
  const [tokensList, setTokensList] = useState([])
  const [value, setValue] = useState({ symbol: props.symbol, searchSymbol: '' })
  const currentToken = useSelector((state) => state.currentToken)
  const [debouncedSymbol] = useDebounce(value.searchSymbol, DEBOUNCE_INPUT)

  const onChange = (event) => {
    setValue({ ...value, searchSymbol: event.target.value })
  }

  const onChooseToken = (event) => {
    props.onChangeSymbol(event.target.dataset.value)
    setTokensList([])
    setValue({ symbol: event.target.dataset.value, searchSymbol: '' })
  }

  const onClearInput = () => {
    props.clearInput()
    setValue({ symbol: '', searchSymbol: '' })
    setTokensList([])
  }

  const setListTokensBySymbol = async () => {
    const list = await getListTokensBySymbol(value.searchSymbol, currentToken.network)
    setTokensList(list)
  }

  useEffect(() => {
    setListTokensBySymbol()
  }, [debouncedSymbol])

  useEffect(() => {
    if (props.symbol === '') setValue({ ...value, symbol: props.symbol })
  }, [props.symbol])

  return (
    <div className="form-block">
      <div className="form-combobox">
        <input
          className={classNames('form-control', {
            'top-border': tokensList.length !== 0,
          })}
          type="text"
          value={value.searchSymbol.length !== 0 ? value.searchSymbol : props.symbol}
          onChange={onChange}
        />
        <button className="form-action" onClick={onClearInput}>
          {(value.searchSymbol.length > 0 || props.symbol.length > 0) && <Close />}
        </button>
      </div>
      {tokensList.length !== 0 && (
        <div className="form-list">
          <ul>
            {tokensList.map((item) => (
              <li key={item.id} data-value={item.symbol} onClick={onChooseToken}>
                {item.symbol}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default InputTokenName
