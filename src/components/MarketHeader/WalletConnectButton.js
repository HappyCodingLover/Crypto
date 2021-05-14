import React, {Component} from 'react';

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions/appActions';
import {ReactComponent as WalletIcon} from '../../assets/images/icons/wallet.svg';
import {ReactComponent as AccountIcon} from '../../assets/images/icons/account.svg';
import classNames from 'classnames';
import {useWeb3React} from "@web3-react/core";
import { getShortAccount, getNetworkByChainId } from '../../utils'

export const walletUrls = {
    eth: 'https://app.zerion.io/',
    bsc: 'https://app.zerion.io/',
}

function WalletConnectButton (props){
    const {connector, activate, deactivate, active, chainId, account} = useWeb3React();
    const networkName = getNetworkByChainId(chainId);
    return (
            <>
                  <div className={classNames('wallet',{open:active})} >
                        <div className="wallet-icon">
                          <WalletIcon onClick={props.openProviderMenu}/>
                        </div>
                       {active?
                           (<><div className="wallet-data">
                                <a href={`${walletUrls[networkName]}${account}/overview`}
                                   target="_blank" rel="noopener noreferrer">{getShortAccount(account)}</a>
                              </div>
                                    <div style={{ borderRadius: 50, overflow: 'hidden',padding: 0, margin: 0, width: 24, height: 24, display: 'inline-block'}}>
                                       <AccountIcon onClick={props.openProviderMenu}/>
                                    </div>

                            </>):''
                       }
                    </div>
            </>
        );

}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

const mapStateToProps = state => ({
    isMobile: state.appReducer.get('isMobileWidth')
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WalletConnectButton);