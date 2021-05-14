import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from './actions/appActions';
import Index from './pages';
import {checkMobile} from "./utils";
import Web3 from 'web3'
import { Web3ReactProvider } from '@web3-react/core'

function getLibrary(provider) {
    return new Web3(provider)
}

class App extends Component {
  constructor(props) {
      super(props);
      console.log(this.props.theme)
      this.state = {
          theme: this.props.theme,
      };
      if(this.state.theme === 'dark')
      document.body.classList.add('dark');

  }

  handleWindowSizeChange = () => {
        const isMobileWidth = checkMobile();
        this.props.actions.setIsMobile(isMobileWidth);
   }
   componentDidMount = ()=>{
      window.addEventListener('resize', this.handleWindowSizeChange);
      this.handleWindowSizeChange();
  }

  render() {
    return (
      <>
        <BrowserRouter>
          <Route component={ScrollToTop} />
            <Web3ReactProvider getLibrary={getLibrary}>
               <Index />
            </Web3ReactProvider>

        </BrowserRouter>
      </>
    );
  }
}

const ScrollToTop = () => {
  window.scrollTo(0, 0);
  return null;
};

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

const mapStateToProps = state => ({
    theme: state.appReducer.get('theme'),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

