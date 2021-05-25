import { dexGuruAPIUrl, periodSidebarChart } from '../config/settings'
import { ChartData } from '../index'
import { Token } from '..'
import { apiFetch } from '../dexguruFetch'

export const loadDataChart = async (
  selectedCurrency: string,
  currentToken: Token
): Promise<ChartData | undefined> => {
  if (!selectedCurrency || !currentToken) {
    return []
  }

  try {
    const begin = Math.round((Date.now() - periodSidebarChart * 3600 * 24 * 1000) / 1000)
    const end = Math.round(Date.now() / 1000)
    const currency = !selectedCurrency || selectedCurrency === 'USD' ? 'USD' : 'ETH'
    const fullAPI = `${dexGuruAPIUrl}/tokens/${currentToken.id}/history?begin_timestamp=${begin}&end_timestamp=${end}&interval=day&currency=${currency}`

    const response = await apiFetch(fullAPI)
    return response.data
  } catch (err) {
    console.error(err)
    return []
  }
}
