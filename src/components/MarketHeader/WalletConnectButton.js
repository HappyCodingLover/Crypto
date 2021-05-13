import React, {Component} from 'react';

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions/appActions';
import {ReactComponent as WalletIcon} from '../../assets/images/icons/wallet.svg';
import {ReactComponent as AccountIcon} from '../../assets/images/icons/account.svg';
import classNames from 'classnames';



class WalletConnectButton extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {

        }
    }

    componentDidMount() {

    }

    render() {
        console.log(this.props.isConnected,'isConnected')
        return (
            <>
                  <div className={classNames('wallet',{open:this.props.isConnected})} >
                        <div className="wallet-icon">
                          <WalletIcon onClick={this.props.openProviderMenu}/>
                        </div>
                       {this.props.isConnected?
                           (<div className="wallet-data">
                                <a href="https://app.zerion.io/0xdD65344cF2F2aE024F9dEfAbBD29A15fF8A70Bac/overview"
                                   target="_blank" rel="noopener noreferrer">0xdD6...0Bac</a>
                                <div>
                                    <div style={{ borderRadius: 50, overflow: 'hidden',padding: 0, margin: 0, width: 24, height: 24, display: 'inline-block'}}>
                                       <AccountIcon/>
                                    </div>
                                </div>
                            </div>):''
                       }
                    </div>
            </>
        );
    }
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

const mapStateToProps = state => ({
    isConnected: state.walletReducer.get('isConnected'),
    isMobile: state.appReducer.get('isMobileWidth')
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WalletConnectButton);