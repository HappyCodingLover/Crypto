import React, { useState } from 'react'
import ReactTooltip from 'react-tooltip'
import InputTokenName from './InputTokenName'
import SelectAmm from './SelectAmm'
import Turtle from '../images/icons/emoji/turtle.svg'
import Shark from '../images/icons/emoji/shark.svg'
import Bot from '../images/icons/emoji/bot.svg'
import Whale from '../images/icons/emoji/whale.svg'
import Badge from '../images/icons/badge.svg'
import Reset from '../images/icons/reset.svg'
import ArrowLess from '../images/icons/arrow-less.svg'
import ArrowMore from '../images/icons/arrow-more.svg'
import ArrowEqual from '../images/icons/arrow-equal.svg'
import Close from '../images/icons/close.svg'
import classNames from 'classnames'
export default function SideFilter(props) {
  const [options, setOptions] = useState(props.optionFilter)

  const walletCategoryData = [
    { icon: <Shark />, value: 'Medium' },
    { icon: <Turtle />, value: 'Casual' },
    { icon: <Bot />, value: 'Bot' },
    { icon: <Whale />, value: 'Heavy' },
  ]

  const dateData = [
    { period: 0, description: 'Today' },
    { period: 1, description: 'Yesterday' },
    { period: 7, description: 'Last 7 days' },
    { period: 30, description: 'Last 30 days' },
  ]

  const onChangeWalletAddress = (event) => {
    setOptions({
      ...options,
      walletAddress: { ...options.walletAddress, value: event.target.value },
    })
  }

  const onChangeDex = (event) => {
    setOptions({ ...options, dex: event.target.value })
  }

  const onChangeTradeSize = (event) => {
    setOptions({
      ...options,
      tradeSize: { ...options.tradeSize, sign: event.target.value },
    })
  }
  const onChangeTradeSizeInput = (event) => {
    setOptions({
      ...options,
      tradeSize: { ...options.tradeSize, value: event.target.value },
    })
  }

  const onChangeWalletCategory = (event) => {
    const walletCategoryValue = options.walletCategoryValue.value
    if (walletCategoryValue.includes(event.target.value)) {
      const index = walletCategoryValue.indexOf(event.target.value)
      walletCategoryValue.splice(index, 1)
    } else {
      walletCategoryValue.push(event.target.value)
    }
    setOptions({
      ...options,
      walletCategoryValue: { ...options.walletCategoryValue, value: walletCategoryValue },
    })
  }

  const onResetWalletCategory = () => {
    setOptions({ ...options, walletCategoryValue: { ...options.walletCategoryValue, value: [] } })
  }

  const onChangeAmm = (event) => {
    setOptions({ ...options, amm: event.value })
  }

  const onChangeSoldTokenRadio = (event) => {
    setOptions({
      ...options,
      soldToken: { ...options.soldToken, sign: event.target.value },
    })
  }
  const onChangeSoldTokenInput = (event) => {
    setOptions({
      ...options,
      soldToken: { ...options.soldToken, value: event.target.value },
    })
  }
  const onChangeSoldTokenSymbol = (tokenSymbol) => {
    setOptions({
      ...options,
      soldToken: {
        ...options.soldToken,
        symbol: tokenSymbol,
      },
    })
  }
  const onChangeBoughtTokenRadio = (event) => {
    setOptions({
      ...options,
      boughtToken: { ...options.boughtToken, sign: event.target.value },
    })
  }
  const onChangeBoughtTokenInput = (event) => {
    setOptions({
      ...options,
      boughtToken: { ...options.boughtToken, value: event.target.value },
    })
  }
  const onChangeBoughtTokenSymbol = (tokenSymbol) => {
    setOptions({
      ...options,
      boughtToken: {
        ...options.boughtToken,
        symbol: tokenSymbol,
      },
    })
  }
  const onChangeDate = (event) => {
    const period = parseFloat(event.target.value)
    const toDate = Date.now()
    const fromDate =
      event.target.value === '0'
        ? new Date().setHours(0, 0, 0, 0)
        : new Date().setDate(new Date().getDate() - period)
    setOptions({
      ...options,
      date: { ...options.date, period: period, from: fromDate, to: toDate },
    })
  }

  const onResetAll = () => {
    setOptions({
      amm: '',
      date: { checked: false, value: [] },
      dex: 'all',
      tradeSize: { checked: false, sign: 'less', value: '' },
      soldToken: { checked: false, sign: 'less', value: '', symbol: '' },
      boughtToken: { checked: false, sign: 'less', value: '', symbol: '' },
      walletAddress: { checked: false, value: '' },
      walletCategoryValue: { checked: false, value: [] },
    })
  }

  const onChangeCheckbox = (event) => {
    const parent = event.target.closest('.form-fieldset')
    event.target.checked ? parent.classList.add('checked') : parent.classList.remove('checked')
    setOptions({
      ...options,
      [event.target.value]: { ...options[event.target.value], checked: event.target.checked },
    })
  }

  const onApplyFilter = () => {
    props.setOptionFilterProps(options)
    props.setOptionFilterProps({
      ...props.optionFilter,
      amm: options.amm,
      dex: options.dex,
      tradeSize: options.tradeSize.checked
        ? options.tradeSize
        : { checked: false, sign: 'less', value: '' },
      soldToken: options.soldToken.checked
        ? options.soldToken
        : { checked: false, sign: 'less', value: '', symbol: '' },
      boughtToken: options.boughtToken.checked
        ? options.boughtToken
        : { checked: false, sign: 'less', value: '', symbol: '' },
      walletAddress: options.walletAddress.checked
        ? options.walletAddress
        : { checked: false, value: '' },
      walletCategoryValue: options.walletCategoryValue.checked
        ? options.walletCategoryValue
        : { checked: false, value: [] },
      date: options.date.checked ? options.date : { checked: false },
    })
    props.closeFilter()
  }

  const walletCategory = walletCategoryData.map((item, index) => (
    <div className="cell--auto" key={index}>
      <label className="form-choice">
        <input
          className="form-choice__hidden"
          type="checkbox"
          name="icon"
          checked={options.walletCategoryValue.value.includes(item.value)}
          value={item.value}
          onChange={onChangeWalletCategory}
        />
        <span className="form-choice__icon">{item.icon}</span>
      </label>
    </div>
  ))

  const date = dateData.map((item, index) => (
    <li className="form-choices__item form-choices__item-half" key={index}>
      <label className="form-choices__variant">
        <input
          className="form-choices__control"
          type="radio"
          name="choice4"
          checked={options.date?.period === item.period}
          value={item.period}
          onChange={onChangeDate}
        />
        <span className="form-choices__label">
          <small className="caption">{item.description}</small>
        </span>
      </label>
    </li>
  ))

  const clearBoughtToken = () => {
    setOptions({
      ...options,
      boughtToken: {
        ...options.boughtToken,
        symbol: '',
      },
    })
  }
  const clearSoldToken = () => {
    setOptions({
      ...options,
      soldToken: {
        ...options.soldToken,
        symbol: '',
      },
    })
  }

  const clearWalletAddress = () => {
    setOptions({
      ...options,
      walletAddress: { ...options.walletAddress, value: '' },
    })
  }
  return (
    <aside className="side-filter">
      <div className="side-filter__header">
        <div className="side-filter__badge">
          <div
            className="badge"
            data-for="badge-tooltip"
            data-tip="This feature provided for free while DexGuru is in Beta.">
            <Badge />
          </div>
          <ReactTooltip
            id="badge-tooltip"
            className="tooltip__badge"
            effect="solid"
            backgroundColor="#181D23"
            textColor="#6D7986"
            offset={{ top: -5 }}
          />
        </div>
        <div className="row row--justify-end">
          <div className="cell--auto">
            <button className="button button--sm button--decline" onClick={onResetAll}>
              <i className="icon">
                <Reset />
              </i>
              <span className="caption">Reset all</span>
            </button>
          </div>
        </div>
      </div>
      <div className="side-filter__body">
        <fieldset className="form-fieldset checked">
          <div className="form-block">
            <legend>Select an AMM</legend>
          </div>
          <div className="form-block">
            <SelectAmm onChange={onChangeAmm} selectedAmm={options.amm} />
          </div>
          <div className="form-block">
            <div className="form-choices">
              <ul className="form-choices__list">
                <li className="form-choices__item">
                  <label className="form-choices__variant">
                    <input
                      className="form-choices__control"
                      checked={options?.dex === 'all'}
                      value={'all'}
                      type="radio"
                      name="choice"
                      onChange={onChangeDex}
                    />
                    <span className="form-choices__label">
                      <small className="caption">All</small>
                    </span>
                  </label>
                </li>
                <li className="form-choices__item">
                  <label className="form-choices__variant">
                    <input
                      className="form-choices__control"
                      checked={options?.dex === 'buy'}
                      value={'buy'}
                      type="radio"
                      name="choice"
                      onChange={onChangeDex}
                    />
                    <span className="form-choices__label">
                      <i className="icon icon--important">
                        <sup className={`dex-sign  ${props.isPoolActivity ? 'plus' : 'up'}`}></sup>
                      </i>
                      <small className="caption">{props.isPoolActivity ? 'Adds' : 'Buy'}</small>
                    </span>
                  </label>
                </li>
                <li className="form-choices__item">
                  <label className="form-choices__variant">
                    <input
                      className="form-choices__control"
                      checked={options?.dex === 'sell'}
                      value={'sell'}
                      type="radio"
                      name="choice"
                      onChange={onChangeDex}
                    />
                    <span className="form-choices__label">
                      <i className="icon icon--important">
                        <sup
                          className={`dex-sign  ${props.isPoolActivity ? 'minus' : 'down'}`}></sup>
                      </i>
                      <small className="caption">{props.isPoolActivity ? 'Removes' : 'Sell'}</small>
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
        </fieldset>
        <fieldset className={classNames('form-fieldset', { checked: options.tradeSize.checked })}>
          <div className="form-block">
            <label className="form-choice">
              <input
                className="form-choice__control"
                type="checkbox"
                value={'tradeSize'}
                checked={options.tradeSize.checked}
                onChange={onChangeCheckbox}
              />
              <span className="form-choice__label">
                <span className="caption">
                  {props.isPoolActivity ? 'Total Value, $' : ' Trade size, USD'}
                </span>
              </span>
            </label>
          </div>
          <div className="form-block">
            <div className="row">
              <div className="cell--auto">
                <div className="form-choices">
                  <ul className="form-choices__list">
                    <li className="form-choices__item">
                      <label className="form-choices__variant">
                        <input
                          className="form-choices__control"
                          type="radio"
                          name="choice1"
                          value={'less'}
                          checked={options.tradeSize?.sign === 'less'}
                          onChange={onChangeTradeSize}
                        />
                        <span className="form-choices__label">
                          <i className="icon">
                            <ArrowLess />
                          </i>
                        </span>
                      </label>
                    </li>
                    <li className="form-choices__item">
                      <label className="form-choices__variant">
                        <input
                          className="form-choices__control"
                          type="radio"
                          name="choice1"
                          value={'more'}
                          checked={options.tradeSize?.sign === 'more'}
                          onChange={onChangeTradeSize}
                        />
                        <span className="form-choices__label">
                          <i className="icon">
                            <ArrowMore />
                          </i>
                        </span>
                      </label>
                    </li>
                    <li className="form-choices__item">
                      <label className="form-choices__variant">
                        <input
                          className="form-choices__control"
                          type="radio"
                          name="choice1"
                          value={'equal'}
                          checked={options.tradeSize?.sign === 'equal'}
                          onChange={onChangeTradeSize}
                        />
                        <span className="form-choices__label">
                          <i className="icon">
                            <ArrowEqual />
                          </i>
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="cell">
                <input
                  className="form-control"
                  type="number"
                  step="any"
                  placeholder="0"
                  value={options.tradeSize.value}
                  onChange={onChangeTradeSizeInput}
                />
              </div>
            </div>
          </div>
        </fieldset>
        <fieldset className={classNames('form-fieldset', { checked: options.soldToken.checked })}>
          <div className="form-block">
            <label className="form-choice">
              <input
                className="form-choice__control"
                type="checkbox"
                value={'soldToken'}
                checked={options.soldToken.checked}
                onChange={onChangeCheckbox}
              />
              <span className="form-choice__label">
                <span className="caption">{props.isPoolActivity ? 'Token, A' : 'Sold Token'}</span>
              </span>
            </label>
          </div>
          <div className="form-block">
            <div className="row">
              <div className="cell--auto">
                <div className="form-choices">
                  <ul className="form-choices__list">
                    <li className="form-choices__item">
                      <label className="form-choices__variant">
                        <input
                          className="form-choices__control"
                          type="radio"
                          name="choice2"
                          checked={options.soldToken?.sign === 'less'}
                          value={'less'}
                          onChange={onChangeSoldTokenRadio}
                        />
                        <span className="form-choices__label">
                          <i className="icon">
                            <ArrowLess />
                          </i>
                        </span>
                      </label>
                    </li>
                    <li className="form-choices__item">
                      <label className="form-choices__variant">
                        <input
                          className="form-choices__control"
                          type="radio"
                          name="choice2"
                          checked={options.soldToken?.sign === 'more'}
                          value={'more'}
                          onChange={onChangeSoldTokenRadio}
                        />
                        <span className="form-choices__label">
                          <i className="icon">
                            <ArrowMore />
                          </i>
                        </span>
                      </label>
                    </li>
                    <li className="form-choices__item">
                      <label className="form-choices__variant">
                        <input
                          className="form-choices__control"
                          type="radio"
                          name="choice2"
                          checked={options.soldToken?.sign === 'equal'}
                          value={'equal'}
                          onChange={onChangeSoldTokenRadio}
                        />
                        <span className="form-choices__label">
                          <i className="icon">
                            <ArrowEqual />
                          </i>
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="cell">
                <input
                  className="form-control"
                  type="number"
                  step="any"
                  placeholder="0"
                  value={options.soldToken.value}
                  onChange={onChangeSoldTokenInput}
                />
              </div>
            </div>
          </div>
          <div className="form-block">
            <InputTokenName
              symbol={options.soldToken.symbol}
              onChangeSymbol={onChangeSoldTokenSymbol}
              clearInput={clearSoldToken}
            />
          </div>
        </fieldset>
        <fieldset className={classNames('form-fieldset', { checked: options.boughtToken.checked })}>
          <div className="form-block">
            <label className="form-choice">
              <input
                className="form-choice__control"
                type="checkbox"
                value={'boughtToken'}
                checked={options.boughtToken.checked}
                onChange={onChangeCheckbox}
              />
              <span className="form-choice__label">
                <span className="caption">
                  {props.isPoolActivity ? 'Token, B' : 'Bought Token'}
                </span>
              </span>
            </label>
          </div>
          <div className="form-block">
            <div className="row">
              <div className="cell--auto">
                <div className="form-choices">
                  <ul className="form-choices__list">
                    <li className="form-choices__item">
                      <label className="form-choices__variant">
                        <input
                          className="form-choices__control"
                          type="radio"
                          name="choice3"
                          checked={options.boughtToken?.sign === 'less'}
                          value={'less'}
                          onChange={onChangeBoughtTokenRadio}
                        />
                        <span className="form-choices__label">
                          <i className="icon">
                            <ArrowLess />
                          </i>
                        </span>
                      </label>
                    </li>
                    <li className="form-choices__item">
                      <label className="form-choices__variant">
                        <input
                          className="form-choices__control"
                          type="radio"
                          name="choice3"
                          checked={options.boughtToken?.sign === 'more'}
                          value={'more'}
                          onChange={onChangeBoughtTokenRadio}
                        />
                        <span className="form-choices__label">
                          <i className="icon">
                            <ArrowMore />
                          </i>
                        </span>
                      </label>
                    </li>
                    <li className="form-choices__item">
                      <label className="form-choices__variant">
                        <input
                          className="form-choices__control"
                          type="radio"
                          name="choice3"
                          checked={options.boughtToken?.sign === 'equal'}
                          value={'equal'}
                          onChange={onChangeBoughtTokenRadio}
                        />
                        <span className="form-choices__label">
                          <i className="icon">
                            <ArrowEqual />
                          </i>
                        </span>
                      </label>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="cell">
                <input
                  className="form-control"
                  type="number"
                  step="any"
                  placeholder="0"
                  value={options.boughtToken.value}
                  onChange={onChangeBoughtTokenInput}
                />
              </div>
            </div>
          </div>
          <div className="form-block">
            <InputTokenName
              symbol={options.boughtToken.symbol}
              onChangeSymbol={onChangeBoughtTokenSymbol}
              clearInput={clearBoughtToken}
            />
          </div>
        </fieldset>
        <fieldset
          className={classNames('form-fieldset', { checked: options.walletAddress.checked })}>
          <div className="form-block">
            <label className="form-choice">
              <input
                className="form-choice__control"
                type="checkbox"
                value={'walletAddress'}
                checked={options.walletAddress.checked}
                onChange={onChangeCheckbox}
              />
              <span className="form-choice__label">
                <span className="caption">Account</span>
              </span>
            </label>
          </div>
          <div className="form-block">
            <div className="form-combobox">
              <input
                className="form-control"
                type="text"
                value={options.walletAddress.value}
                onChange={onChangeWalletAddress}
              />
              <button className="form-action cross-grey" onClick={clearWalletAddress}>
                {options.walletAddress.value.length > 0 && <Close />}
              </button>
            </div>
          </div>
        </fieldset>
        {!props.isPoolActivity && (
          <fieldset
            className={classNames('form-fieldset', {
              checked: options.walletCategoryValue.checked,
            })}>
            <div className="form-block wallet-category">
              <label className="form-choice">
                <input
                  className="form-choice__control"
                  type="checkbox"
                  value={'walletCategoryValue'}
                  checked={options.walletCategoryValue.checked}
                  onChange={onChangeCheckbox}
                />
                <span className="form-choice__label">
                  <span className="caption">Wallet</span>
                </span>
              </label>
              <button className="button button--link" onClick={onResetWalletCategory}>
                <small className="caption">Clear</small>
              </button>
            </div>
            <div className="form-block">
              <div className="row row--gap-xs row--justify-between">{walletCategory}</div>
            </div>
          </fieldset>
        )}

        <fieldset className={classNames('form-fieldset', { checked: options.date.checked })}>
          <div className="form-block">
            <label className="form-choice">
              <input
                className="form-choice__control"
                type="checkbox"
                value={'date'}
                checked={options.date.checked}
                onChange={onChangeCheckbox}
              />
              <span className="form-choice__label">
                <span className="caption">Date</span>
              </span>
            </label>
          </div>
          <div className="form-block">
            <div className="form-choices">
              <ul className="form-choices__list">{date}</ul>
            </div>
          </div>
          {/*<div className="form-block">
            <div className="form-calendar">
              <div className="form-calendar__header">
                <strong className="form-calendar__title">
                  <span className="caption">September 2020</span>
                </strong>
                <div className="form-calendar__nav">
                  <button
                    className="form-calendar__control form-calendar__control--prev"
                    href="#"
                    aria-label="Previous month">
                    <i className="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none">
                        <path
                          stroke="#181D23"
                          strokeLinecap="round"
                          stroke-linejoin="round"
                          d="M5.10742.714339L.821707 5.00005 5.10742 9.28577"></path>
                      </svg>
                    </i>
                  </button>
                  <button
                    className="form-calendar__control form-calendar__control--next"
                    href="#"
                    aria-label="Next month">
                    <i className="icon">
                      <svg xmlns="http://www.w3.org/2000/svg" width="6" height="10" fill="none">
                        <path
                          stroke="#181D23"
                          strokeLinecap="round"
                          stroke-linejoin="round"
                          d="M.892578 9.28566L5.17829 4.99995.892578.714233"></path>
                      </svg>
                    </i>
                  </button>
                </div>
              </div>
              <div className="form-calendar__body">
                <div className="form-calendar__days">
                  <span className="form-calendar__day">
                    <span className="caption">Sun</span>
                  </span>
                  <span className="form-calendar__day">
                    <span className="caption">Mon</span>
                  </span>
                  <span className="form-calendar__day">
                    <span className="caption">Tue</span>
                  </span>
                  <span className="form-calendar__day">
                    <span className="caption">Wen</span>
                  </span>
                  <span className="form-calendar__day">
                    <span className="caption">Thu</span>
                  </span>
                  <span className="form-calendar__day">
                    <span className="caption">Fri</span>
                  </span>
                  <span className="form-calendar__day">
                    <span className="caption">Sat</span>
                  </span>
                </div>
                <div className="form-calendar__dates">
                  <span className="form-calendar__date">
                    <span className="caption">28</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">29</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">30</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">1</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">2</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">3</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">4</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">5</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">6</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">7</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">8</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">9</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">10</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">11</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">12</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">13</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">14</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">15</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">16</span>
                  </span>
                  <span className="form-calendar__date  is--selected-start is--selected">
                    <span className="caption">17</span>
                  </span>
                  <span className="form-calendar__date  is--selected">
                    <span className="caption">18</span>
                  </span>
                  <span className="form-calendar__date  is--selected">
                    <span className="caption">19</span>
                  </span>
                  <span className="form-calendar__date  is--selected">
                    <span className="caption">20</span>
                  </span>
                  <span className="form-calendar__date  is--selected">
                    <span className="caption">21</span>
                  </span>
                  <span className="form-calendar__date  is--selected">
                    <span className="caption">22</span>
                  </span>
                  <span className="form-calendar__date  is--selected">
                    <span className="caption">23</span>
                  </span>
                  <span className="form-calendar__date  is--selected">
                    <span className="caption">24</span>
                  </span>
                  <span className="form-calendar__date  is--selected">
                    <span className="caption">25</span>
                  </span>
                  <span className="form-calendar__date  is--selected">
                    <span className="caption">26</span>
                  </span>
                  <span className="form-calendar__date  is--selected">
                    <span className="caption">27</span>
                  </span>
                  <span className="form-calendar__date  is--selected">
                    <span className="caption">28</span>
                  </span>
                  <span className="form-calendar__date  is--selected">
                    <span className="caption">29</span>
                  </span>
                  <span className="form-calendar__date  is--selected">
                    <span className="caption">30</span>
                  </span>
                  <span className="form-calendar__date  is--selected-end is--selected">
                    <span className="caption">31</span>
                  </span>
                  <span className="form-calendar__date">
                    <span className="caption">1</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="form-block">
            <input
              className="form-control"
              type="text"
              value="15 May 2020 — 1 June 2020"
              readOnly="readOnly"
            />
      </div>*/}
        </fieldset>
        {/*<fieldset className="form-fieldset">
          <div className="form-block">
            <input className="form-control" type="text" placeholder="placeholder" />
          </div>
          <div className="form-block">
            <input className="form-control" type="number" />
          </div>
          <div className="form-block">
            <textarea className="form-textarea"></textarea>
          </div>
        </fieldset>
        <fieldset className="form-fieldset">
          <div className="form-block">
            <div className="form-choices">
              <ul className="form-choices__list">
                <li className="form-choices__item">
                  <label className="form-choices__variant">
                    <input className="form-choices__control" type="radio" name="choice" />
                    <span className="form-choices__label">
                      <small className="caption">All</small>
                    </span>
                  </label>
                </li>
                <li className="form-choices__item">
                  <label className="form-choices__variant">
                    <input className="form-choices__control" type="radio" name="choice" />
                    <span className="form-choices__label">
                      <i className="icon icon--important">
                        <svg xmlns="http://www.w3.org/2000/svg" width="9" height="8" fill="none">
                          <path fill="#22D59F" d="M3.83301 0h1.33333v8H3.83301z"></path>
                          <path fill="#22D59F" d="M.5 4.66699V3.33366h8v1.33333z"></path>
                        </svg>
                      </i>
                      <small className="caption">Adds</small>
                    </span>
                  </label>
                </li>
                <li className="form-choices__item">
                  <label className="form-choices__variant">
                    <input className="form-choices__control" type="radio" name="choice" />
                    <span className="form-choices__label">
                      <i className="icon icon--important">
                        <svg xmlns="http://www.w3.org/2000/svg" width="8" height="8" fill="none">
                          <path fill="#FF646D" d="M0 4.66699V3.33366h8v1.33333z"></path>
                        </svg>
                      </i>
                      <small className="caption">Removes</small>
                    </span>
                  </label>
                </li>
              </ul>
            </div>
          </div>
    </fieldset>*/}
      </div>
      <div className="side-filter__footer">
        <div className="side-filter__submit">
          <button className="button button--md button--accept" onClick={onApplyFilter}>
            <span className="caption">Apply</span>
          </button>
        </div>
      </div>
    </aside>
  )
}
