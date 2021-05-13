import React, {Component} from 'react';
import { Tabs, Tab } from 'react-bootstrap';

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions/appActions';
import TokenList from "./TokenList";
import {COIN_MARKET_CAP_URL} from '../../env';
import { api } from '../../services/Api';
class DropdownSearch extends Component {

    constructor(props){
        super(props);
        this.props = props;
        this.state = {
            filter: 'up',
            upList:[],
            favouriteList:[],
            walletList:[],
            up:{
                filtered:[]
            },
            favourites:{

                filtered:[]
            },
            wallet:{

                filtered:[]
            },

        }
    }
    changeFilterSearch = (filter)=>{
        this.setState({filter:filter})
    }
    componentDidMount(){

    }
    render() {
        return <div className={`dropdown-search ${this.props.isActiveSearch ? 'show' : 'none'} ${this.state.filter}`}>
            <div className="dropdown-search-filter">
                <Tabs defaultActiveKey="up">
                    <Tab eventKey="up" title="Top Values">
                      <TokenList status={this.state.up} favourite={this.state.favouriteList}/>
                    </Tab>
                    <Tab eventKey="favourite" title="Favourites">
                        <TokenList status={this.state.favourites} favourite={this.state.favouriteList}/>
                    </Tab>
                    <Tab eventKey="wallet" title="Wallet">
                        <TokenList status={this.state.wallet} favourite={this.state.favouriteList}/>
                    </Tab>
                </Tabs>
            </div>

        </div>
    }
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

const mapStateToProps = state => ({
    isMobile: state.appReducer.get('isMobileWidth'),
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DropdownSearch);