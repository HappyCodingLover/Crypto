import React, { useEffect, useState } from 'react'
import { Router, Route, Redirect, Switch } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { createBrowserHistory, History } from 'history'
import { setIsMobile, setSettings } from './actions'
import { checkMobile } from './helpers/appHelpers'
import * as serviceWorker from './serviceWorker'
import { useEagerConnect } from './hooks'
import Web3Wrapper from './containers/Web3Wrapper'
import { useSnackbar } from 'notistack'
import { getSettingsFromLocalStorage } from './services/preferencesService'

const history: History = createBrowserHistory()

interface WaitingWorker {
  postMessage?: (action: { type: string }) => void
}

const newVersionSnackbar = (enqueueSnackbar: Function, actions: Function) =>
  enqueueSnackbar('A new version of this app is available', {
    persist: true,
    action: actions(),
  })

const App = () => {
  const reduxDispatch = useDispatch()
  const { enqueueSnackbar } = useSnackbar()
  const [waitingWorker, setWaitingWorker] = useState<WaitingWorker>({ postMessage: undefined })
  const [newVersionAvailable, setNewVersionAvailable] = useState(false)

  const accountsList = JSON.parse(localStorage.getItem('accounts') || '[]')
  useEagerConnect(!accountsList)

  const onServiceWorkerUpdate = (registration: any) => {
    setWaitingWorker(registration?.waiting)
    setNewVersionAvailable(true)
  }

  const updateServiceWorker = () => {
    if (!waitingWorker || !waitingWorker.postMessage) {
      return
    }
    waitingWorker && waitingWorker.postMessage({ type: 'SKIP_WAITING' })
    setNewVersionAvailable(false)
    window.location.reload()
  }

  const refreshAction = () => {
    //render the snackbar button
    return (
      <div className="snackbar-button" onClick={updateServiceWorker} id="button-refresh">
        {'Refresh'}
      </div>
    )
  }

  const handleWindowSizeChange = () => {
    const isMobileWidth = checkMobile()
    reduxDispatch(setIsMobile(isMobileWidth))
  }

  useEffect(() => {
    handleWindowSizeChange()
    window.addEventListener('resize', handleWindowSizeChange)

    if (process.env.NODE_ENV === 'production') {
      serviceWorker.register({ onUpdate: onServiceWorkerUpdate })
    }
    if (newVersionAvailable) {
      //show snackbar with refresh button
      newVersionSnackbar(enqueueSnackbar, refreshAction)
    }

    const settings = getSettingsFromLocalStorage()
    reduxDispatch(setSettings(settings))

    return () => {
      window.removeEventListener('resize', handleWindowSizeChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    const buttonRefresh = document.querySelector('#button-refresh')
    if (buttonRefresh && newVersionAvailable) {
      newVersionSnackbar(enqueueSnackbar, refreshAction)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newVersionAvailable, enqueueSnackbar])

  return (
    <Router history={history}>
      <Switch>
        <Route exact path={['/', '/token/:token']}>
          <Web3Wrapper />
        </Route>
        <Route path="*">
          <Redirect to={{ pathname: '/' }} />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
