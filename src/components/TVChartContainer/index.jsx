import * as React from 'react'
import { widget } from '../../charting_library/charting_library'
import Loader from '../Loader'
import TVChartResources from './resources/TVChartResources'
import { connect } from 'react-redux'

function getLanguageFromURL() {
  const regex = new RegExp('[\\?&]lang=([^&#]*)')
  const results = regex.exec(window.location.search)
  return results === null ? null : decodeURIComponent(results[1].replace(/\+/g, ' '))
}

class TVChartContainer extends React.PureComponent {
  constructor(props) {
    super(props)

    this.state = {
      ready: true,
    }

    var that = this

    this.observer = new MutationObserver(function (mutations) {
      mutations.forEach(function (mutation) {
        if (mutation.type === 'attributes') {
          that.updateWidget()
        }
      })
    })

    this.timer = null
    this.tvWidget = null
    this.mounted = true
  }

  static defaultProps = TVChartResources

  GetWidgetOptions() {
    const savedData = this.getSavedData(this.props.symbolName)
    return {
      symbol: this.props.symbolName,
      datafeed: new window.Datafeeds.UDFCompatibleDatafeed(this.props.datafeedUrl, 180 * 1000),
      interval: this.props.interval,
      container_id: this.props.containerId,
      library_path: this.props.libraryPath,
      locale: getLanguageFromURL() || 'en',
      disabled_features: this.props.disabledFeatures,
      charts_storage_url: this.props.chartsStorageUrl,
      charts_storage_api_version: this.props.chartsStorageApiVersion,
      client_id: this.props.clientId,
      user_id: this.props.userId,
      fullscreen: this.props.fullscreen,
      autosize: this.props.autosize,
      studies_overrides: this.props.studiesOverrides,
      theme: 'Dark',
      loading_screen: { backgroundColor: '#283038' },
      preset: undefined, // always desktop mode
      time_frames: this.props.time_frames,
      overrides: {
        'paneProperties.background': '#232A32',
        'paneProperties.vertGridProperties.color': '#2E3740',
        'paneProperties.horzGridProperties.color': '#2E3740',
        'scalesProperties.textColor': '#7B7F84',
      },
      custom_css_url: '/themed.css',
      ...(savedData ? { saved_data: savedData } : {}),
    }
  }

  componentDidMount() {
    this.mounted = true
    this.observer.observe(document.documentElement, {
      attributes: true, //configure it to listen to attribute changes
    })
    this.props.setLoading(true)
    this.timer = window.setTimeout(() => {
      this.props.setLoading(false)
      this.mounted &&
        this.setState({ ready: false }, () => {
          this.props.setLoading(false)
        })
    }, 20000)
    const widgetOptions = this.GetWidgetOptions()
    const tvWidget = new widget(widgetOptions)
    this.tvWidget = tvWidget
    this.tvWidget.onChartReady(() => {
      this.tvWidget
        .activeChart()
        .onDataLoaded()
        .subscribe(
          null,
          () => {
            this.props.setLoading(false)
            this.setState({ ready: false })
          },
          true
        )
      this.tvWidget.subscribe('onAutoSaveNeeded', this.onAutoSaveNeeded)
    })
    this.updateHeight()
    window.addEventListener('resize', this.updateHeight)
  }

  updateHeight = () => {
    const tvChartContainer = document.getElementById('tv_chart_container')

    if (tvChartContainer && !this.props.isMobile) {
      tvChartContainer.style.height = 'auto'

      const layout = tvChartContainer.closest('.main__wrapper')

      let diff = parseFloat(getComputedStyle(layout).height)
      layout.children.forEach((child) => {
        diff -= parseFloat(getComputedStyle(child).height)
      })

      const tvChartContainerHeight = parseFloat(getComputedStyle(tvChartContainer).height)

      tvChartContainer.style.height = tvChartContainerHeight + diff + 'px'
    }
  }

  changePair() {
    var widget = this.tvWidget
    this.setState({ ready: true })
    this.timer = window.setTimeout(() => {
      this.mounted &&
        this.setState({ ready: false }, () => {
          this.props.setLoading(false)
        })
    }, 10000)
    if (widget) {
      widget.onChartReady(() => {
        if (widget) {
          const chart = widget.chart()
          chart.setSymbol(this.props.symbolName, function e() {})
          this.tvWidget
            .activeChart()
            .onDataLoaded()
            .subscribe(
              null,
              () => {
                this.setState({ ready: false })
              },
              true
            )
          this.tvWidget.subscribe('onAutoSaveNeeded', this.onAutoSaveNeeded)
        }
      })
    }
  }

  componentWillUnmount() {
    this.mounted = false
    window.clearTimeout(this.timer)
    window.removeEventListener('resize', this.updateHeight)

    if (this.tvWidget !== null) {
      this.tvWidget.remove()
      this.tvWidget = null
    }
    this.observer.disconnect()
  }
  componentDidUpdate(prevProps) {
    if (this.props.symbolName && prevProps.symbolName !== this.props.symbolName) this.changePair()
    if (prevProps.theme !== this.props.theme) {
      this.updateWidget()
    }
  }

  onAutoSaveNeeded = () => {
    const tvWidget = this.tvWidget
    tvWidget.save((chartState) => {
      localStorage.setItem(tvWidget._options.symbol, JSON.stringify(chartState))
    })
  }

  getSavedData = (symbol) => {
    const savedString = localStorage.getItem(symbol)
    if (!savedString) {
      return null
    }

    return JSON.parse(savedString)
  }

  updateWidget() {
    this.setState({ ready: true })
    if (this.tvWidget) {
      this.tvWidget.remove()
      this.tvWidget = null
    }
    const widgetOptions = this.GetWidgetOptions()
    const tvWidget = new widget(widgetOptions)
    this.tvWidget = tvWidget
    this.tvWidget.onChartReady(() => {
      this.tvWidget
        .activeChart()
        .onDataLoaded()
        .subscribe(
          null,
          () => {
            this.setState({ ready: false })
          },
          true
        )
      this.tvWidget.subscribe('onAutoSaveNeeded', this.onAutoSaveNeeded)
    })
  }

  render() {
    return (
      <React.Fragment>
        {this.state.ready && (
          <div className="chart-loader">
            <Loader />
          </div>
        )}
        <div id={this.props.containerId} className="TVChartContainer" />
      </React.Fragment>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    isMobile: state.isMobile,
  }
}

export default connect(mapStateToProps, null)(TVChartContainer)
