import ETH from '../images/icons/tokens/eth.svg'
import AMPL from '../images/icons/tokens/ampl.svg'
import { TokenIcon } from '../index'
import web3 from 'web3'
import { coingeckoAPIUrl } from '../config/settings'
import { apiFetch } from '../dexguruFetch'

const CUSTOM_ICONS = [
  {
    id: '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2',
    logo: ETH,
  },
  {
    id: '0xd46ba6d942050d489dbd938a2c909a5d5039a161',
    logo: AMPL,
  },
]

export const isCustomIconOfToken = (tokenId: string): boolean => {
  return !!CUSTOM_ICONS.find((token) => token.id === tokenId)
}

const getReactComponentOfToken = (tokenId: string): TokenIcon => {
  const token = CUSTOM_ICONS.find((token) => token.id === tokenId)
  return token?.logo || null
}

export const getIconToken = async (id: string, network: string): Promise<TokenIcon> => {
  if (id && network) {
    const customIconToken = isCustomIconOfToken(id)
    if (customIconToken) {
      return getReactComponentOfToken(id)
    }
    const trustWalletIconNetwork = network === 'eth' ? 'ethereum' : 'smartchain'
    const coingeckoIconNetwork = network === 'eth' ? 'ethereum' : 'binance-smart-chain'
    const address = web3.utils.toChecksumAddress(id)
    const trustWalletIconUrl = `https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/${trustWalletIconNetwork}/assets/${address}/logo.png`
    const trustWalletResponse = await apiFetch(trustWalletIconUrl, {
      init: { cache: 'force-cache' },
      mapErrorTo: { shouldMap: true, targetValue: null },
      expectJson: false,
      expectText: true,
    })

    if (!trustWalletResponse) {
      const coingeckoIconUrl = `${coingeckoAPIUrl}/coins/${coingeckoIconNetwork}/contract/${id}`
      const coingeckoResponse = await apiFetch(coingeckoIconUrl, {
        init: { cache: 'force-cache' },
        mapErrorTo: { shouldMap: true, targetValue: null },
        expectJson: true,
      })

      // https://app.clubhouse.io/dexguru/story/1991/critical-app-load-randomly-stuck-on-preloader#activity-2231
      if (coingeckoResponse) {
        return new String(Object(coingeckoResponse.image).small)
      }
    }
    return new String(trustWalletIconUrl)
  }

  return null
}
