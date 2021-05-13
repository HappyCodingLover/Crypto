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


class SearchToken extends Component {
    constructor(props) {
        super(props);
        this.props = props;
        this.state = {
            tokenKey: '',
            isActiveSearch: false,
            placeHolder:''
        }
    }
    tokenKeyChange = (e)=>{
        this.setState({tokenKey:e.target.value});
    }

    componentDidMount() {

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
                                        <img className="icon-token"
                                             src="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/smartchain/assets/0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c/logo.png"
                                             alt="WBNB" title="WBNB">
                                        </img>
                                    </div>
                                </div>
                            </div>
                            <span className="token-name" title="WBNB">
                                BNB<span className="network-bsc">&nbsp;BSC</span>
                            </span>
                        </div>
                        <div className="token-value">
                            <span className="sign">$</span>
                            <span title="660.0132446315434">660.01</span>
                            <sup className="triangle index down" title="0.05804898447731538">0.06%</sup>
                        </div>
                    </div>
                    <OutsideClicker clickHide={this.searchHide} isActiveSearch={this.state.isActiveSearch}>
                        <React.Fragment>
                            <div className="right-part">
                                { this.state.isActiveSearch?
                                    <input className="input-search" placeholder={this.state.placeHolder}
                                           value={this.state.tokenKey}  onChange={this.tokenKeyChange}/> : ''
                                }
                                <div className="icon-search">
                                    <SearchIcon onClick={this.searchShow} />
                                </div>
                            </div>
                            <div className="dropdown-search-wrapper">
                                <DropdownSearch
                                    isActiveSearch={this.state.isActiveSearch}
                                    searchHide={this.searchHide}
                                    debouncedText={this.state.debouncedText}
                                    openProviderMenu={this.openProviderMenu}
                                    changeFavoriteToken={this.changeFavoriteToken}
                                    favorites={this.props.favorites}
                                    setSearchSymbol={this.setSearchSymbol}
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
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SearchToken);