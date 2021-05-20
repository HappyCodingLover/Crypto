import { ReactComponent as Unknown } from './assets/images/icons/unknown.svg'
import web3 from 'web3'
import {WBNB_ADDRESS, ZERO_X_ETH_ADDRESS, zeroXAPIUrlBsc} from "./env";
import {BigNumber} from "bignumber.js";
import {api} from "./services/Api";
export const coingeckoAPIUrl = 'https://api.coingecko.com/api/v3';

export const getShortNumber = (number, decimal) => {
    if (number > 100000000) return `${(number / 1000000000).toFixed(decimal)}b`
    if (number > 100000) return `${(number / 1000000).toFixed(decimal)}m`
    if (number > 100) return `${(number / 1000).toFixed(decimal)}k`
    return number
}

export const numberWithCommas = (x) => {
    if(x===0)return 0;
    if (!x) return NaN
    const parts = x.toString().split('.')

    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    return parts[1] && parts[1] === '' ? `${parts[0]}.` : parts.join('.')
}

export const getFormatNumber = (number,decimal=0)=>{
    if(!number) number = 0;
     return number.toFixed(decimal);

}

export const getTokenAddressFromId = (token) => {

    return token.id ? token.id.split('-')[0] : token.split('-')[0];
}

export const getIconToken = async (id, network) => {


    if (id && network) {

        const trustWalletIconNetwork = network === 'eth' ? 'ethereum' : 'smartchain'
        const coingeckoIconNetwork = network === 'eth' ? 'ethereum' : 'binance-smart-chain'
        const address = web3.utils.toChecksumAddress(id);

        const trustWalletIconUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${trustWalletIconNetwork}/assets/${address}/logo.png`
        const trustWalletRequest = await fetch(trustWalletIconUrl, {
            cache: 'force-cache',
        })

        if (trustWalletRequest.status !== 200) {
            const coingeckoIconUrl = `${coingeckoAPIUrl}/coins/${coingeckoIconNetwork}/contract/${id}`
            const coingeckoRequest = await fetch(coingeckoIconUrl, {
                cache: 'force-cache',
            })
            if (coingeckoRequest.status !== 200) {
                return Unknown
            }
            const response = await coingeckoRequest.json()
            return Object(response.image).small
        } else {

            return trustWalletIconUrl
        }
    }
}

export const checkMobile = () =>{
    return document.documentElement.offsetWidth <= 600;

}

export const getShortAccount = (account) => {
    return account.substring(0, 5) + '...' + account.substring(account.length - 4)
}

export const getNetworkByChainId = (chainId) => {
    if (chainId === 56) {
        return 'bsc'
    }
    if (chainId === 1) {
        return 'eth'
    }
}

export const getQuoteInfo  = async (ftoken,ttoken,amount) =>{
    return new Promise((resolve,reject)=>{
        const fromTokenAddress =
            getTokenAddressFromId(ftoken) === WBNB_ADDRESS
                ? ZERO_X_ETH_ADDRESS
                : getTokenAddressFromId(ftoken)
        const toTokenAddress =

            getTokenAddressFromId(ttoken) === WBNB_ADDRESS
                ? ZERO_X_ETH_ADDRESS
                : getTokenAddressFromId(ttoken)

        const url = `${zeroXAPIUrlBsc}/swap/v1/quote?sellToken=${fromTokenAddress}&buyToken=${toTokenAddress}&sellAmount=${new BigNumber(amount).times(10 ** 18).toFixed(0)}`;
        api('get',url)
            .then(res=> {
               resolve(res.data);
            })
            .catch(err=>{
               reject(err)
            });
    })



}
