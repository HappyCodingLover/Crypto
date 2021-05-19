import React from 'react';
import { useState } from 'react';
import Classnames from 'classnames';
import TokenSelect from './TokenSelect'
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions/appActions';

function TokenTrade(props) {
  const [tradingType,setTradingType] = useState('buy');
  const valueChanged = (value,type) =>{
      console.log(value,type);
  }
  return (
    <>
      <div className="token-trade mb15 p-1">
         <div className="token-trade-container">
             <div className="token-trade-type-select">
                 <span className={Classnames({active:tradingType=='buy'})}
                 onClick={()=>setTradingType('buy')}>BUY</span>
                 <span className={Classnames({active:tradingType=='sell'})}
                       onClick={()=>setTradingType('sell')}>SELL</span>

             </div>
             <div className={Classnames('token-trade-box',{active:tradingType=='buy'})}>
                 <label>From</label>
                 <TokenSelect onChange={(val)=> valueChanged(val,true)}/>
                 <label>To</label>
                 <TokenSelect disable={true} token={props.selectedToken} onChange={(val)=> valueChanged(val,false)}/>
                 <button className="btn btn-outline-success full-width">BUY {props.selectedToken.symbol}</button>
             </div>
             <div className={Classnames('token-trade-box',{active:tradingType=='sell'})}>
                 <label>From</label>
                 <TokenSelect disable={true} token={props.selectedToken} onChange={(val)=> valueChanged(val,false)}/>
                 <label>To</label>
                 <TokenSelect onChange={(val)=> valueChanged(val,true)}/>
                 <button className="btn btn-outline-danger full-width">SELL {props.selectedToken.symbol}</button>
             </div>
         </div>
      </div>
    </>
  );
}


const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

const mapStateToProps = state => ({
    selectedToken: state.walletReducer.get('selectedToken')
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TokenTrade);