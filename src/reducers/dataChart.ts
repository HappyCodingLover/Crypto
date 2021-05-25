import { AnyAction } from 'redux'
import { ChartData } from '../index'

export const SET_DATA_CHART = 'SET_DATA_CHART'

const dataChart = (state: DataChartState | null = null, action: AnyAction) => {
  switch (action.type) {
    case SET_DATA_CHART:
      return action.dataChart
    default:
      return state
  }
}

export type DataChartState = ChartData

export default dataChart
