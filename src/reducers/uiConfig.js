
import  actionTypes  from '../actions/actionTypes';
const uiConfig = (
    state = {
        theme: 'dark',
        isMobileWidth:false,
        isShowProviderDialog:false,
        favouriteList:[]
    },
    action
) => {
    switch (action.type) {
        case actionTypes.THEME_UPDATE: {
            const { theme } = action.payload
            return { ...state, theme: theme }
        }
        case actionTypes.IS_MOBILE: {
            const { isMobileWidth } = action.payload
            return { ...state, isMobileWidth: isMobileWidth }
        }
        case actionTypes.OPEN_PROVIDER_MENU: {
            const { status } = action.payload
            return { ...state, isShowProviderDialog: status }
        }

        default:
            return state
    }
}



export default uiConfig;



