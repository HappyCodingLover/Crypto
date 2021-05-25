import React from 'react'
import { Line } from 'react-chartjs-2'
import { financialFormat, getShortNumber } from '../utils'
export default class Chart extends React.Component {
  render() {
    const data = (canvas) => {
      const ctx = canvas.getContext('2d')
      const gradient = ctx.createLinearGradient(0, 0, 0, 100)
      gradient.addColorStop(0, 'rgba(169, 18, 163, 0)')
      gradient.addColorStop(1, '#5771CD')

      return {
        labels: this.props.date,
        datasets: [
          {
            backgroundColor: gradient,
            borderColor: this.props.color,
            borderWidth: 3,
            pointRadius: 0,
            hitRadius: 15,
            data: this.props.data,
          },
        ],
      }
    }

    const currency = this.props.currency

    const options = {
      responsive: true,
      datasetStrokeWidth: 3,
      tooltips: {
        mode: 'index',
        intersect: false,
        titleFontFamily: 'Poppins, sans-serif',
        bodyFontFamily: 'Poppins, sans-serif',
        footerFontFamily: 'Poppins, sans-serif',
        callbacks: {
          label: function (tooltipItem, data) {
            var label = data.datasets[tooltipItem.datasetIndex].label || ''
            label += financialFormat(tooltipItem.yLabel)
            return label
          },
        },
      },
      legend: {
        display: false,
      },
      scales: {
        yAxes: [
          {
            type: 'logarithmic',
            ticks: {
              fontFamily: 'Poppins, sans-serif',
              fontSize: 10,
              fontColor: '#545C66',
              autoSkip: true,
              maxTicksLimit: 4,
              beginAtZero: true,
              min: 0,
              callback: function (value) {
                return currency === 'USD'
                  ? ('$' + getShortNumber(value, 2) + '   ').replace('.00', '')
                  : getShortNumber(value, 2) + ' ETH   '
              },
            },
            gridLines: {
              drawBorder: false,
              drawOnChartArea: true,
              color: '#29313A',
              drawTicks: false,
              tickMarkLength: 10,
              zeroLineColor: '#29313A',
            },
          },
        ],
        xAxes: [
          {
            ticks: {
              fontFamily: 'Poppins, sans-serif',
              fontSize: 10,
              fontColor: '#545C66',
              padding: 4,

              maxRotation: 0,
              minRotation: 0,
              autoSkip: false,
              maxTicksLimit: 4,
              callback: function (value) {
                return value
              },
            },
            afterBuildTicks: (axis, ticks) => {
              let newTicks = []
              if (ticks.length < 10) {
                ticks.forEach((tick, idx) => {
                  newTicks.push(idx % 2 ? tick : null)
                })
                return newTicks
              } else {
                let monthsData = []
                let monthsList = []
                ticks.forEach((tick, idx) => {
                  let month = tick.split(' ')[1]
                  if (!monthsData[month]) {
                    monthsData[month] = { start: idx }
                    monthsList.push(month)
                  }
                  monthsData[month].end = idx
                })
                monthsList.forEach((month) => {
                  let length = monthsData[month].end - monthsData[month].start + 1
                  let monthTicks = Array(monthsData[month].end - monthsData[month].start + 1)
                  if (length > 6) {
                    monthTicks[Math.round(length / 2)] = month
                  }

                  newTicks.push(...monthTicks)
                })
                return newTicks
              }
            },
            gridLines: {
              drawOnChartArea: false,
              drawTicks: true,
              tickMarkLength: 6,
              color: '#29313A',
            },
          },
        ],
      },
      pointDotStrokeWidth: 0,
      animation: {
        duration: 0,
      },
    }

    return (
      <React.Fragment>
        <Line data={data} options={options} />
      </React.Fragment>
    )
  }
}
