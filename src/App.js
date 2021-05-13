import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from './actions/appActions';
import Index from './pages';
import {checkMobile} from "./utils";

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
        console.log(isMobileWidth)
        this.props.actions.setIsMobile(isMobileWidth);
   }

  themeUpdate = ()=>{
      let theme = this.state.theme === 'light'
          ? (this.theme = 'dark')
          : (this.theme = 'light');
      this.setState((state) => ({
          theme: theme

      }));

      this.props.actions.updateTheme(theme);

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
          <ThemeProvider
            value={{
              data: this.state,
              update: this.themeUpdate
            }}
          >
            <Index />
          </ThemeProvider>
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

