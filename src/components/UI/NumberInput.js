import React from 'react';
import { useState } from 'react';
import Classnames from 'classnames';
import {numberWithCommas} from "../../utils";

export default function NumberInput(props) {
    const [value,setValue] = useState(0);
    const valueChanged = (e)=>{
        let cur_val;
        cur_val = e.target.value;
        cur_val = cur_val.replaceAll(",","");
        if(cur_val=='') {
            return setValue('');
            props.onChange('');
        }
        if(isNaN(parseFloat(cur_val)) || parseFloat(cur_val) != cur_val) return;
        cur_val = parseFloat(cur_val);
        setValue(numberWithCommas(cur_val));
        props.onChange(numberWithCommas(cur_val));
    }
    return (
        <input {...props} onChange={valueChanged}  disabled={props.disable} value={value}/>
    );
}
