import React, { Component } from 'react';
import {Modal,Button} from 'react-bootstrap';
import connectors from "./config";

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions/appActions';

import Web3 from "web3";
import Web3Modal from "web3modal";




class exchange extends Component {
    constructor(props) {
        super(props);
    }
    handleClose = ()=>{
        this.props.actions.openProvierMenu(false);
    }
    connectToWallet = async (config)=>{
        console.log(config)
        const providerOptions = {
            /* See Provider Options Section */
        };
        const web3Modal = new Web3Modal({
            network: "mainnet", // optional
            cacheProvider: true, // optional
            providerOptions // required
        });
        const provider = await web3Modal.connect();
        console.log(provider)
        const web3 = new Web3(provider);
        provider.on("accountsChanged", (accounts) => {
            console.log(accounts);
        });

        // Subscribe to chainId change
        provider.on("chainChanged", (chainId) => {
            console.log(chainId);
        });

        // Subscribe to provider connection
        provider.on("connect", (info) => {
            console.log(info);
        });

        // Subscribe to provider disconnection
        provider.on("disconnect", (error) => {
            console.log(error);
        });

    }
    render() {
        return (<Modal
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            show={this.props.isShowProviderDialog} onHide={this.handleClose}
            className="providerDialog"
        >
            <Modal.Header closeButton>
                <Modal.Title className="text-center" style={{width:'calc(100% - 50px)'}}>Select Wallet Provider</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="row">
                    { connectors.map((connect,index)=>{

                        return <div key={index} className="col-lg-6 col-md-12 col-xs-12">
                            <Button variant="outline-primary" className="wallet-item"
                            onClick={()=>{this.connectToWallet(connect)}}>
                                <connect.icon/>
                                {connect.title}
                            </Button>
                        </div>
                      })
                    }



                </div>
            </Modal.Body>
            <Modal.Footer>
                <a target="_blank" rel="noreferrer noopener" href="https://docs.pancakeswap.finance/guides/faq#how-do-i-set-up-my-wallet-on-binance-smart-chain"
                   color="primary">
                    <svg viewBox="0 0 20 20" color="primary" style={{marginTop:-2,marginRight:5}} width="20px" xmlns="http://www.w3.org/2000/svg"
                         className="sc-bdfBwQ hlWuDy">
                        <path fill="#007bff" d="M10 0C4.48 0 0 4.48 0 10C0 15.52 4.48 20 10 20C15.52 20 20 15.52 20 10C20 4.48 15.52 0 10 0ZM10 18C5.59 18 2 14.41 2 10C2 5.59 5.59 2 10 2C14.41 2 18 5.59 18 10C18 14.41 14.41 18 10 18ZM9 14H11V16H9V14ZM10.61 4.04C8.55 3.74 6.73 5.01 6.18 6.83C6 7.41 6.44 8 7.05 8H7.25C7.66 8 7.99 7.71 8.13 7.33C8.45 6.44 9.4 5.83 10.43 6.05C11.38 6.25 12.08 7.18 12 8.15C11.9 9.49 10.38 9.78 9.55 11.03C9.55 11.04 9.54 11.04 9.54 11.05C9.53 11.07 9.52 11.08 9.51 11.1C9.42 11.25 9.33 11.42 9.26 11.6C9.25 11.63 9.23 11.65 9.22 11.68C9.21 11.7 9.21 11.72 9.2 11.75C9.08 12.09 9 12.5 9 13H11C11 12.58 11.11 12.23 11.28 11.93C11.3 11.9 11.31 11.87 11.33 11.84C11.41 11.7 11.51 11.57 11.61 11.45C11.62 11.44 11.63 11.42 11.64 11.41C11.74 11.29 11.85 11.18 11.97 11.07C12.93 10.16 14.23 9.42 13.96 7.51C13.72 5.77 12.35 4.3 10.61 4.04Z"></path>
                    </svg>
                    Learn how to connect</a>
                {
                    !this.props.walletIsConnected?
                        '':
                        (<Button  variant="outline-success" style={{justifyContent:'center',alignItems:'center',display:'flex',margin: '16px auto 0',fontSize:'18px',borderRadius:'10px',width:'180px'}}
                                  onClick={this.handleClose}>
                            Disconnect
                        </Button>)
                }


            </Modal.Footer>
        </Modal>)
    }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

const mapStateToProps = state => ({
    isShowProviderDialog: state.walletReducer.get('isShowProviderDialog'),
    walletIsConnected:state.walletReducer.get('isConnected'),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(exchange);