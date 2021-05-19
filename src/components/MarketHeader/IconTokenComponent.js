import React,{useState,useEffect} from 'react'
import { ReactComponent as Unknown } from '../../assets/images/icons/unknown.svg'
import {getIconToken,getTokenAddressFromId} from '../../utils'
const IconTokenComponent = ({ item }) => {

    const [IconToken, setIconToken] = useState(Unknown);
    const getTokenIcons = async () => {
        if(!item.id) {setIconToken(Unknown);return;}
        const tokenIcon = await getIconToken(getTokenAddressFromId(item),'bsc');
        setIconToken(tokenIcon)

    }
    useEffect(() => {
        getTokenIcons();
    }, [item])

    return typeof IconToken === 'string' ? (
        <img className="icon-token" src={`${IconToken}`} alt={`${item.symbol}`} title={`${item.symbol}`} />
    ) : (
        <IconToken />
    )
}

export default IconTokenComponent
