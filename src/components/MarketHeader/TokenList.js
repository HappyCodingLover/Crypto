import React, {Component} from 'react';

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import * as Actions from '../../actions/appActions';
import {ReactComponent as FavouriteIcon} from '../../assets/images/icons/favorite.svg';
import {getFormatNumber,getIconToken} from '../../utils'
import Classnames from 'classnames';
import IconTokenComponent from "./IconTokenComponent";
import { ReactComponent as Unknown } from '../../assets/images/icons/unknown.svg'

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
    getTokenIcon = async (token) => {
        const tokenIcon = await getIconToken(token,'bsc');
        return tokenIcon;
    }
    render() {

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
            {
                this.props.filtered.map(item=>{
                   return <tr onClick={()=>this.props.onClick(item)}>
                       <td>
                           <FavouriteIcon/>
                       </td>
                       <td>
                           <Unknown /> {/*<IconTokenComponent IconToken={this.getTokenIcon()} symbol={item.symbol} />*/}
                           {item.symbol}
                       </td>
                       <td className={Classnames('text-right',{hidden:this.props.isMobile && this.state.mobileView!='volume'})}>
                           <span className="sign">$</span>{getFormatNumber(item.quotes[2].volume24h)}</td>
                       <td className={Classnames('text-right',{hidden:this.props.isMobile && this.state.mobileView!='liguidity'})}>
                           <span className="sign">$</span>{getFormatNumber(item.quotes[2].marketCap)}</td>
                       <td className={Classnames('text-right',{hidden:this.props.isMobile && this.state.mobileView!='price'})}>
                           <div className="token-price-delta">
                               <sup className= {`triangle ${(item.quotes && item.quotes[2].percentChange24h < 0) ? 'down' : 'up'}`} >
                                   {getFormatNumber(item.quotes?item.quotes[2].percentChange24h:0,2)}%
                               </sup>
                           </div>
                           <div className="sum-part">
                               <span className="sign">$</span>{getFormatNumber(item.quotes[2].price,2)}
                           </div>

                       </td>
                   </tr>
                })
            }


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