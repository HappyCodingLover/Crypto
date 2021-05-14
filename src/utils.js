import { ReactComponent as Unknown } from './assets/images/icons/unknown.svg'

export const getShortNumber = (number, decimal) => {
    if (number > 100000000) return `${(number / 1000000000).toFixed(decimal)}b`
    if (number > 100000) return `${(number / 1000000).toFixed(decimal)}m`
    if (number > 100) return `${(number / 1000).toFixed(decimal)}k`
    return number
}
export const getFormatNumber = (number,decimal=0)=>{
     return number.toFixed(decimal);

}
export const getTokenAddressFromId = (token) => {
    return token.id ? token.id.split('-')[0] : token.split('-')[0]
}
export const getIconToken = async (id, network) => {
    return Unknown;
    /*if (id && network) {
        const customIconToken = isCustomIconOfToken(id)
        if (customIconToken) {
            return getReactComponentOfToken(id)
        }
        const trustWalletIconNetwork = network === 'eth' ? 'ethereum' : 'smartchain'
        const coingeckoIconNetwork = network === 'eth' ? 'ethereum' : 'binance-smart-chain'
        const address = web3.utils.toChecksumAddress(id)
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
            return new String(Object(response.image).small)
        }
        return new String(trustWalletIconUrl)
    }*/
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
