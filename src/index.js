import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import App from './App';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/css/ionicons.min.css';
import './assets/scss/style.scss';

import { store } from './services/reduxService'
import {Web3ReactProvider} from "@web3-react/core";
import Web3 from "web3";

function getLibrary(provider) {
    return new Web3(provider)
}
ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
          <Web3ReactProvider getLibrary={getLibrary}>
             <App/>
          </Web3ReactProvider>
      </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
