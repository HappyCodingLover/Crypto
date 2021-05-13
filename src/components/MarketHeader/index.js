import React, { Component } from 'react';
import { Navbar, Nav, NavDropdown, Dropdown, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { ThemeConsumer } from '../../context/ThemeContext';
import SearchToken from './SearchToken';
import WalletConnectButton from './WalletConnectButton';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions/appActions';
import Classnames from 'classnames';
class MarketHeader extends Component {
  constructor(props){
    super(props);
    this.state = {
      isActiveSearch:false
    }
  }
  setActiveSearch = (active)=>{
     this.setState({isActiveSearch:active});
  }
  componentDidMount() {
    let el = document.querySelector('#darkTheme');
    if (el) {
      el.addEventListener('click', function () {
        document.body.classList.toggle('dark');
      });
    }
  }
  openProviderMenu = ()=>{
      this.props.actions.openProvierMenu(true);
  }
  render() {
    return (
      <>
        <header className={Classnames("light-bb",{'mobile':this.props.isMobileWidth})} >
          <Navbar>
            <Link className="navbar-brand" to="/">
              <ThemeConsumer>
                {({ data }) => {
                  return data.theme === 'light' ? (
                    <img src={'img/logo-dark.svg'} alt="logo" />
                  ) : (
                    <img src={'img/logo-light.svg'} alt="logo" />
                  );
                }}
              </ThemeConsumer>
            </Link>
            <SearchToken isMobileWidth={this.props.isMobileWidth}/>

              <Navbar.Collapse id="basic-navbar-nav">
                <Nav className={Classnames('navbar-nav ml-auto',{'mobile':this.props.isMobileWidth})}>
                <Dropdown className="header-custom-icon">
                    <ThemeConsumer>
                        {({ data, update }) => (
                            <Button variant="default" onClick={update} id="darkTheme">
                                {data.theme === 'light' ? (
                                    <i className="icon ion-md-moon"></i>
                                ) : (
                                    <i className="icon ion-md-sunny"></i>
                                )}
                            </Button>

                        )}
                    </ThemeConsumer>
                </Dropdown>
                <Dropdown className="header-wallet-icon">
                   <WalletConnectButton openProviderMenu={this.openProviderMenu}/>
                </Dropdown>

              </Nav>
            </Navbar.Collapse>
          </Navbar>
        </header>
      </>
    );
  }
}

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

const mapStateToProps = state => ({
    isMobileWidth: state.appReducer.get('isMobileWidth'),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MarketHeader);