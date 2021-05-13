import React, { Component } from 'react';
import TokenStatus from '../components/TokenStatus';
import TokenTrade from '../components/TokenTrade';
import WalletChart from '../components/WalletChart';
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../actions/appActions';
import ConnectModal from '../components/Wallet/ConnectModal'


 class exchange extends Component {
  constructor(props){
    super(props);
  }

  render() {
      console.log(this.props.theme)
    return (
      <>
        <div className="container-fluid mtb15 no-fluid">
          <div className="row sm-gutters">
            <div className="col-sm-12 col-md-3">
              <TokenStatus />
            </div>
            <div className="col-sm-12 col-md-6">
                 <div className="main-chart mb15">
                      <TradingViewWidget
                          symbol="BTCUSD"
                          theme={this.props.theme === 'dark'?Themes.DARK:Themes.LIGHT}
                          locale="en"
                          autosize
                      />
                  </div>
            </div>
            <div className="col-sm-12 col-md-3">
              <TokenTrade />
            </div>
              <div className="col-sm-12 col-md-12">
                  <WalletChart>
                  </WalletChart>
              </div>
          </div>
        </div>
        <ConnectModal/>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

const mapStateToProps = state => ({
    isShowProviderDialog: state.walletReducer.get('isShowProviderDialog'),
    walletIsConnected:state.walletReducer.get('isConnected'),
    theme:state.appReducer.get('theme')
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(exchange);