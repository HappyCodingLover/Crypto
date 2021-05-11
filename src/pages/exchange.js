import React, { Component } from 'react';
import TokenStatus from '../components/TokenStatus';
import TokenTrade from '../components/TokenTrade';
import TradingChart from '../components/TradingChart';
import WalletChart from '../components/WalletChart';
import TradingChartDark from '../components/TradingChartDark';
import { ThemeConsumer } from '../context/ThemeContext';

export default class exchange extends Component {
  render() {
    return (
      <>
        <div className="container-fluid mtb15 no-fluid">
          <div className="row sm-gutters">
            <div className="col-sm-12 col-md-3">
              <TokenStatus />
            </div>
            <div className="col-sm-12 col-md-6">
              <ThemeConsumer>
                {({ data }) => {
                  return data.theme === 'light' ? (
                    <TradingChart />
                  ) : (
                    <TradingChartDark />
                  );
                }}
              </ThemeConsumer>
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
      </>
    );
  }
}
