
import {Button} from "react-bootstrap";
import React,{useEffect}from "react";
import { useWeb3React, UnsupportedChainIdError } from '@web3-react/core'
import { MetaMask,WalletConnectBsc,BSCConnector} from '../../connector';
import Classnames from 'classnames';
const connectorsByName = {
    MetaMask: MetaMask,
    WalletConnect: WalletConnectBsc,
    "Binance Chain Wallet": BSCConnector,
}

export default function WalletCard(props) {

    const { connector, activate, deactivate, active, error, account } = useWeb3React()
    const connected = props.connect.connector === connector;


    const connectToWallet =  async (conf)=> {
        if(active) return;
        if(conf.title !== "WalletConnect")
            connectorsByName.WalletConnect.close();

        console.log(`${active} connected`,conf.connector)
        activate(conf.connector, console.error);
        props.handleClose();

    }
    return (
        <>
            <div className="col-lg-6 col-md-12 col-xs-12">
                <Button variant="outline-primary" className={Classnames('wallet-item',{active:connected})}
                        onClick={()=>{connectToWallet(props.connect)}}>
                    <props.connect.icon/>
                    {props.connect.title}

                </Button>
            </div>
        </>
    )
}
