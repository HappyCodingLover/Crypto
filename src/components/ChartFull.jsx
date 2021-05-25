import React,{useEffect} from 'react'
import { Line, Chart } from 'react-chartjs-2'
import { getShortNumber } from '../utils'
import { ammConfig } from '../config/amm'



const ChartFull = (props) => {

  const customTooltip = (tooltipModel) => {
    let tooltipEl = document.querySelector('#chartjs-tooltip')
    let chartEl = document.querySelector('.chartjs')
    if (!tooltipEl) {
      tooltipEl = document.createElement('div')
      tooltipEl.id = 'chartjs-tooltip'
      tooltipEl.innerHTML = '<table></table>'
      document.body.appendChild(tooltipEl)
    }

    if (tooltipModel.opacity === 0) {
      tooltipEl.style.opacity = 0
      return
    }
    const getBody = (bodyItem) => {
      return bodyItem.lines
    }
    const getDataPoints = (dataPoints) => {
      return dataPoints.y
    }
    let positionTopPoint
    if (tooltipModel.body) {
      let bodyLines = tooltipModel.body.map(getBody)
      positionTopPoint = Math.min(...tooltipModel.dataPoints.map(getDataPoints))
      let innerHtml = `<tbody><tr><td class="date">${tooltipModel.title}<td></tr>`
      bodyLines.forEach(function (body, i) {
        const [amm, value] = body[0].split(': ')
        let colors = tooltipModel.labelColors[i]
        let style = 'background-color:' + colors.borderColor
        let span = '<span class="dot" style="' + style + '"></span>'
        if (colors.borderColor !== 'transparent') {
          innerHtml += `<tr><td>${span}$${getShortNumber(
            value,
            2
          )}&nbsp;<span class="capitalize">${amm}</span></td></tr>`
        }
      })
      innerHtml += '</tbody>'

      let tableRoot = tooltipEl.querySelector('table')
      tableRoot.innerHTML = innerHtml
    }
    let position = chartEl.getBoundingClientRect()
    let positionTooltip = tooltipEl.getBoundingClientRect()
    tooltipEl.style.opacity = '1'
    tooltipEl.style.position = 'absolute'
    tooltipEl.style.left =
      position.width - tooltipModel.caretX < positionTooltip.width
        ? tooltipModel.caretX - positionTooltip.width + 12 + 'px'
        : tooltipModel.caretX + 36 + 'px'
    tooltipEl.style.top =
      position.bottom - (position.bottom - positionTopPoint) / 2 - tooltipModel.height + 'px'
  }

  const data = (canvas) => {
    const ctx = canvas.getContext('2d')
    const chartDataGroupedByAmm = props.chartDataGroupedByAmm
    return {
      labels: props.date,
      datasets: Object.keys(chartDataGroupedByAmm).map((amm) => {
        const config = ammConfig(amm)
        // Charts that are not shown should be rendered to keep y axis scale the same
        const isShown = props.ammBtns[amm] === true
        return {
          label: amm,
          backgroundColor: isShown ? config.getGradient(ctx) : 'transparent',
          pointHoverBackgroundColor: isShown ? config.borderColor : 'transparent',
          borderColor: isShown ? config.borderColor : 'transparent',
          pointHoverBorderColor: isShown ? 'rgba(30, 36, 44, 0.4)' : 'transparent',
          borderWidth: 3,
          pointHoverBorderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 6,
          hitRadius: 15,
          data: chartDataGroupedByAmm[amm].map((item) =>
            props.isLeft
              ? currency === 'USD'
                ? item.totalLiquidityUSD
                : item.liquidity
              : currency === 'USD'
              ? item.dailyVolumeUSD
              : item.volume
          ),
        }
      }),
    }
  }

  const currency = props.currency

  const options = {
    responsive: true,
    datasetStrokeWidth: 3,
    tooltips: {
      mode: 'index',
      intersect: false,
      enabled: false,
      borderColor: 'rgba(0, 0, 0, 1)',
      borderWidth: 1,
      groupStroke: {
        style: 'rgba(255,255,255,.2)',
        width: 1,
        end: 'max',
      },
      custom: customTooltip,
    },
    legend: {
      display: false,
    },
    scales: {
      yAxes: [
        {
          ticks: {
            fontFamily: 'Poppins, sans-serif',
            fontSize: 12,
            fontColor: '#545C66',

            max: props.yAxisMax,
            maxTicksLimit: 4,
            callback: function (value) {
              return currency === 'USD'
                ? '$' + getShortNumber(value, 2) + '   '
                : getShortNumber(value, 2) + ' ETH   '
            },
          },
          gridLines: {
            drawBorder: false,
            drawOnChartArea: false,
            color: '#545c66',
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
            fontSize: 12,
            fontColor: '#545C66',
            padding: 4,

            maxTicksLimit: 3,
            maxRotation: 0,
            minRotation: 0,
            callback: function (value) {
              const [date, month] = value.split(' ')
              const shownMonth = month.slice(0, 3)
              return `${date} ${shownMonth}`
            },
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
    hover: {
      mode: 'index',
      intersect: false,
    },
  }

  useEffect(()=>{
      Chart.pluginService.register({
          afterDraw: (chart) => {
              let activePoints = chart.tooltip._active
              let groupStroke = chart.options.tooltips.groupStroke

              if (activePoints && activePoints.length && groupStroke) {
                  var activePoint = activePoints[0],
                      ctx = chart.ctx,
                      x = activePoint.tooltipPosition().x,
                      topY = chart.chartArea.top,
                      bottomY = chart.chartArea.bottom

                  let points = []
                  chart.tooltip._active.forEach((tooltip) => {
                      if (tooltip._model.backgroundColor !== 'transparent') points.push(tooltip._model.y)
                  })
                  let max = Math.max.apply(null, points)
                  let min = Math.min.apply(null, points)

                  if (groupStroke.end === 'min') {
                      topY = max
                  }
                  if (groupStroke.end === 'max') {
                      topY = min
                  }

                  // draw line
                  ctx.save()
                  ctx.beginPath()
                  ctx.moveTo(x, topY)
                  ctx.lineTo(x, bottomY)
                  ctx.lineWidth = chart.options.tooltips.groupStroke.width
                  ctx.strokeStyle = chart.options.tooltips.groupStroke.style
                  ctx.stroke()
                  ctx.restore()
              }
          },
      })
  },[])
  return (
    <React.Fragment>
      <div className="chartjs">
        <Line type={'interactedLine'} data={data} options={options} />
        <div id="chartjs-tooltip">
          <table></table>
        </div>
      </div>
    </React.Fragment>
  )
}

export default ChartFull
