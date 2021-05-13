import React, {Component} from 'react';

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions/appActions';
import {ReactComponent as FavouriteIcon} from '../../assets/images/icons/favorite.svg'
import Classnames from 'classnames';

class TokenList extends Component {

    constructor(props){
       super(props)
        this.state = {
            mobileView: 'volume'
        }
    }
    changedViewColumn = (e)=>{
         this.setState({mobileView:e.target.value});
    }
    render() {
        console.log(this.props)
        return <table className="table">
            <thead>
            <tr>
                <th></th>
                <th>Name</th>
                {!this.props.isMobile?(
                    <>
                        <th className="text-right">Volume,24h</th>
                        <th className="text-right">Liguidity</th>
                        <th className="text-right">Price</th>
                    </>):(
                    <th>
                        <select onChange={this.changedViewColumn} value={this.state.mobileView}>
                            <option value="volume">Volume,24h</option>
                            <option value="liguidity">Liguidity</option>
                            <option value="price">Price</option>
                        </select>
                    </th>
                )
                }

            </tr>
            </thead>
            <tbody>
            <tr>
                <td>
                    <FavouriteIcon/>
                </td>
                <td>
                    ETH
                </td>
                <td className={Classnames('text-right',{hidden:this.props.isMobile && this.state.mobileView!='volume'})}>
                    <span className="sign">$</span>2,362,941,027</td>
                <td className={Classnames('text-right',{hidden:this.props.isMobile && this.state.mobileView!='liguidity'})}>
                    <span className="sign">$</span>421,462,199</td>
                <td className={Classnames('text-right',{hidden:this.props.isMobile && this.state.mobileView!='price'})}>
                    <div className="token-price-delta">
                        <sup className="triangle up ">0.04%</sup>
                    </div>
                    <div className="sum-part">
                        <span className="sign">$</span>1.00
                    </div>

                </td>
            </tr>
            <tr>
                <td>
                    <FavouriteIcon/>
                </td>
                <td>
                    UNI
                </td>
                <td className={Classnames('text-right',{hidden:this.props.isMobile && this.state.mobileView!='volume'})}>
                    <span className="sign">$</span>2,362,941,027</td>
                <td className={Classnames('text-right',{hidden:this.props.isMobile && this.state.mobileView!='liguidity'})}>
                    <span className="sign">$</span>462,199</td>
                <td className={Classnames('text-right',{hidden:this.props.isMobile && this.state.mobileView!='price'})}>
                    <div className="token-price-delta">
                        <sup className="triangle down">22.04%</sup>
                    </div>
                    <div className="sum-part">
                        <span className="sign">$</span>3,3209.10
                    </div>

                </td>
            </tr>
            </tbody>
        </table>
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
)(TokenList);