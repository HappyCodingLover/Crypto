import React from 'react'
import { useSelector } from 'react-redux'
export default function DropdownSearchHead(props) {
  const isMobile = useSelector((state) => state.isMobile)

  const changeOption = (event) => {
    props.setOptionDropdown(event.target.value)
  }

  return (
    <thead className="dropdown-search__thead">
      <tr>
        <th className="token__favorite" />
        <th className="token__name" colSpan="2">
          Name
        </th>
        {!isMobile && (
          <React.Fragment>
            <th className="token__volume">Volume, 24h</th>
            <th className="token__liquidity">Liquidity</th>
            <th className="token__price">Price</th>
            <th className="token__price-delta" />
          </React.Fragment>
        )}
        {isMobile && (
          <th className="token__option" colSpan="2">
            <select className="option-selector" onChange={changeOption}>
              <option value="0">Volume, 24h</option>
              <option value="1">Liquidity</option>
              <option value="2">Price</option>
            </select>
          </th>
        )}
      </tr>
    </thead>
  )
}
