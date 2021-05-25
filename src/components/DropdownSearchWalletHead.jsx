import React from 'react'
import { useSelector } from 'react-redux'
export default function DropdownSearchWalletHead(props) {
  const isMobile = useSelector((state) => state.isMobile)

  const changeOption = (event) => {
    props.setOptionWallet(event.target.value)
  }

  return (
    <thead className="dropdown-search__thead">
      <tr>
        {!isMobile && (
          <React.Fragment>
            <th className="token__icon" />
            <th className="token__name">Asset</th>
          </React.Fragment>
        )}
        {isMobile && (
          <th className="token__name" colSpan="2">
            Name
          </th>
        )}
        <th className="token__balance">Balance</th>
        {!isMobile && (
          <React.Fragment>
            <th className="token__value">Value</th>
            <th className="token__price">Price</th>
            <th className="token__price-delta" />
          </React.Fragment>
        )}
        {isMobile && (
          <th className="token__option" colSpan="2">
            <select
              className="option-selector"
              defaultValue={props.optionWallet}
              onChange={changeOption}>
              <option value="0">Value</option>
              <option value="1">Price</option>
            </select>
          </th>
        )}
      </tr>
    </thead>
  )
}
