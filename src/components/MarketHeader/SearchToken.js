import React, {Component} from 'react';
import {ReactComponent as Favorite} from '../../assets/images/icons/favorite.svg'
import {ReactComponent as SearchIcon} from '../../assets/images/icons/search.svg'
import {ReactComponent as CloseIcon} from '../../assets/images/icons/close.svg'
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions/appActions';
import OutsideClicker from './OutsideClicker';
import DropdownSearch from './DropdownSearch'
import classNames from 'classnames';
import {api} from '../../services/Api';
import {TOKEN_LIST_URL} from '../../env';
import {getFormatNumber} from "../../utils";
import {ReactComponent as Unknown} from "../../assets/images/icons/unknown.svg";

class SearchToken extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            tokens:[],
            tokenKeyword: '',
            isActiveSearch: false,
            placeHolder:''
        }
    }
    tokenKeywordChange = (e)=>{
        this.setState({tokenKeyword:e.target.value});
    }

    componentDidMount() {
       api('get',TOKEN_LIST_URL)
           .then((res)=>{
               let tokens = res.data? (res.data.data? res.data.data.cryptoCurrencyList || [] : [] ):[];
               this.setState({tokens:tokens});
               if(!this.props.selectedToken.symbol){
                   this.props.actions.setSelectedToken(tokens[0]);
               }
           })
           .catch(err=>{

           })
    }
    searchShow = () => {
        this.setState({isActiveSearch:true,placeHolder:'Search Market'});
    }
    searchHide = () => {
        this.setState({isActiveSearch:false,placeHolder:''});
    }
    render() {
        return (
            <>
                <div className={classNames('search', { open: this.state.isActiveSearch }, { mobile: this.props.isMobileWidth })} >
                    { this.props.isMobileWidth?
                        <div className="close-market">
                           <CloseIcon/>
                        </div>:''}
                    <div className="left-part" onClick={this.searchShow} >
                        <div className="token">
                            <div className="token-favorite heart favorite">
                                <Favorite/>
                            </div>
                            <div className="token-icons">
                                <div className="token-icon token-border-network bsc">
                                    <div className="token-border large">
                                        <Unknown />
                                    </div>
                                </div>
                            </div>
                            <span className="token-name" title="WBNB">
                                {this.props.selectedToken.symbol}<span className="network-bsc"></span>
                            </span>
                        </div>
                        <div className="token-value">
                            <span className="sign">$</span>
                            <span title="660.0132446315434">{getFormatNumber(this.props.selectedToken.quotes?this.props.selectedToken.quotes[2].price:0,2)}</span>
                            <sup className={`triangle index ${(this.props.selectedToken.quotes && this.props.selectedToken.quotes[2].percentChange24h < 0)?'down':'up'}`}>{getFormatNumber(this.props.selectedToken.quotes?this.props.selectedToken.quotes[2].percentChange24h:0,2)}%</sup>
                        </div>
                    </div>
                    <OutsideClicker clickHide={this.searchHide} isActiveSearch={this.state.isActiveSearch}>
                        <React.Fragment>
                            <div className="right-part">
                                { this.state.isActiveSearch?
                                    <input className="input-search" placeholder={this.state.placeHolder}
                                           value={this.state.tokenKeyword}  onChange={this.tokenKeywordChange}/> : ''
                                }
                                <div className="icon-search">
                                    <SearchIcon onClick={this.searchShow} />
                                </div>
                            </div>
                            <div className="dropdown-search-wrapper">
                                <DropdownSearch
                                    isActiveSearch={this.state.isActiveSearch}
                                    searchHide={this.searchHide}
                                    openProviderMenu={this.openProviderMenu}
                                    tokens={this.state.tokens}
                                    keyword={this.state.tokenKeyword}
                                    onSelected={()=>{this.setState({isActiveSearch:false}) }}
                                />
                            </div>
                        </React.Fragment>
                    </OutsideClicker>

                </div>
            </>
        );
    }
}
const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(Actions, dispatch)
});

const mapStateToProps = state => ({
    isMobileWidth: state.appReducer.get('isMobileWidth'),
    selectedToken: state.walletReducer.get('selectedToken')
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchToken);