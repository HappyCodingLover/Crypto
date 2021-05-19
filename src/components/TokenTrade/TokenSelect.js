import React from 'react';
import { useState } from 'react';
import Classnames from 'classnames';
import NumberInput from '../UI/NumberInput';
export default function TokenTrade(props) {
    console.log(props.token,props.disable)
    return (
    <div className="token-selection">
        <div className="token-section">
          <div className={Classnames({fixed:props.disable})}>
            {props.token?props.token.symbol:''}
          </div>
        </div>
        <NumberInput disable={props.disable} onChange={props.onChange}/>
    </div>
  );
}
