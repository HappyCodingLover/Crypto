import Uniswap from '../images/icons/amm/uniswap.svg'
import UniswapV3 from '../images/icons/amm/uniswap-v3.svg'
import Sushiswap from '../images/icons/amm/sushiswap.svg'
import Pancakeswap from '../images/icons/amm/pancakeswap.svg'
import PancakeswapV2 from '../images/icons/amm/pancakeswap-v2.svg'
import Default from '../images/icons/amm/default.svg'
import Mooniswap from '../images/icons/amm/mooniswap.svg'

/* border and gradient for charts
  #63EAB9; background: linear-gradient(90deg, #003687 -2.17%, #019CFF 100%); mooniswap
  #FFC555; background: linear-gradient(104.04deg, #FFC555 0%, #0148FF 100%); uniswap
  #FFFFFF; background: linear-gradient(104.04deg, #4C0584 0%, #B500AD 100%); uniswapV3
  #EA6394; background: linear-gradient(104.04deg, #98254F 0%, #5200FF 100%); pancakeswap
  #00C8B0; background: linear-gradient(104.04deg, #00C8B0 0%, #191FB7 100%); pancakeswapV2
  #0094FF; background: linear-gradient(104.04deg, #7000FF 0%, #FF6C01 100%); sushiswap
  #CF92FF; background: linear-gradient(104.04deg, #9E2FF5 0%, #FF6838 100%); dforce
  #FF7B7B; background: linear-gradient(104.04deg, #FF7B7B 0%, #097BCE 100%); default
*/

const ammMooniswap = {
  icon: Mooniswap,
  borderColor: '#63EAB9',
  getGradient: (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, 'rgba(0, 54, 135,0.6)')
    gradient.addColorStop(1, 'rgba(1, 156, 255,0.6)')
    return gradient
  },
}

const ammUniswap = {
  icon: Uniswap,
  borderColor: '#FFC555',
  getGradient: (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, 'rgba(255, 197, 85,0.6)')
    gradient.addColorStop(1, 'rgba(1, 72, 255,0.6)')
    return gradient
  },
}
const ammUniswapV3 = {
  icon: UniswapV3,
  borderColor: '#FFFFFF',
  getGradient: (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, 'rgba(255, 197, 85,0.6)')
    gradient.addColorStop(1, 'rgba(181, 0, 173,0.6)')
    return gradient
  },
}

const ammPancakeswap = {
  icon: Pancakeswap,
  borderColor: '#EA6394',
  getGradient: (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, 'rgba(76, 5, 132, 0.6)')
    gradient.addColorStop(1, 'rgba(82, 0, 255, 0.6)')
    return gradient
  },
}

const ammPancakeswapV2 = {
  icon: PancakeswapV2,
  borderColor: '#00C8B0',
  getGradient: (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, 'rgba(0, 200, 176, 0.6)')
    gradient.addColorStop(1, 'rgba(25, 31, 183, 0.6)')
    return gradient
  },
}
const ammSushiswap = {
  icon: Sushiswap,
  borderColor: '#0094FF',
  getGradient: (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, 'rgba(112, 0, 255, 0.6)')
    gradient.addColorStop(1, 'rgba(255, 108, 1, 0.6)')
    return gradient
  },
}

const ammDforce = {
  borderColor: '#CF92FF',
  icon: Default,
  getGradient: (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, 'rgba(158, 47, 245, 0.6)')
    gradient.addColorStop(1, 'rgba(255, 104, 56, 0.6)')
    return gradient
  },
}

const ammDefault = {
  borderColor: '#FF7B7B',
  icon: Default,
  getGradient: (ctx) => {
    const gradient = ctx.createLinearGradient(0, 0, 0, 400)
    gradient.addColorStop(0, 'rgba(255, 123, 123, 0.6)')
    gradient.addColorStop(1, 'rgba(9, 123, 206, 0.6)')
    return gradient
  },
}

export const ammConfig = (amm) => {
  switch (amm) {
    case 'uniswap':
      return ammUniswap
    case 'uniswap_v3':
      return ammUniswapV3
    case 'sushiswap':
      return ammSushiswap
    case 'pancakeswap':
      return ammPancakeswap
    case 'mooniswap':
      return ammMooniswap
    case 'dforce':
      return ammDforce
    case 'pancakeswap_v2':
      return ammPancakeswapV2
    default:
      return ammDefault
  }
}
