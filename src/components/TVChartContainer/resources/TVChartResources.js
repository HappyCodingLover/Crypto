import { dexGuruAPIUrl } from '../../../config/settings'

const TVChartsDefault = {
  symbol: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599_USD',
  interval: '60',
  containerId: 'tv_chart_container',
  datafeedUrl: `${dexGuruAPIUrl}/tradingview`,
  libraryPath: '/charting_library/',
  chartsStorageUrl: 'https://saveload.tradingview.com',
  chartsStorageApiVersion: '1.1',
  timeframe: '7D',
  fullscreen: false,
  autosize: true,
  load_last_chart: true,
  studiesOverrides: {},
  auto_save_delay: 5,
  disabledFeatures: ['header_symbol_search', 'display_market_status', 'header_saveload'],
  time_frames: [
    { text: '1y', resolution: '1D', description: '1 Month' },
    { text: '1m', resolution: '240', description: '1 Month' },
    { text: '7d', resolution: '60', description: '5 Days' },
    { text: '1d', resolution: '30', description: '1 Day', title: '1d' },
    { text: '12h', resolution: '10', description: '1 Day', title: '12h' },
    { text: '7d', resolution: '60', description: 'Default', title: 'Default' },
  ],
}

export default TVChartsDefault
