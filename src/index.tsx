import 'react-app-polyfill/ie11'
import 'react-app-polyfill/stable'
import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'
import App from './App'
import { store } from './services/reduxService'
import { SnackbarProvider } from 'notistack'
import Web3 from 'web3'
import { Web3ReactProvider } from '@web3-react/core'
import testServer from './test/testServer'
// gtmService init
// eslint-disable-next-line unused-imports/no-unused-imports,no-unused-vars
import gtmService from './services/gtmService'

import './scss/index.scss'

function getLibrary(provider:any) {
    return new Web3(provider)
}

// export const store = createStore(rootReducer, applyMiddleware(navigateOnSetAccount))

if (process.env.REACT_APP_ENV === 'development') {
    testServer()
}

console.log('environment: ' + process.env.REACT_APP_ENV)

ReactDOM.render(
    <Provider store={store}>
        <Web3ReactProvider getLibrary={getLibrary}>
            <SnackbarProvider
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'center',
                }}>
                <App />
            </SnackbarProvider>
        </Web3ReactProvider>
    </Provider>,
    document.getElementById('root')
)


