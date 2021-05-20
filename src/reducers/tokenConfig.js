
import  actionTypes  from '../actions/actionTypes';
const uiConfig = (
    state = {
       selectedToken:{},
       tempTokens:[]
    },
    action
) => {
    switch (action.type) {
        case actionTypes.SET_SELECTED_TOKEN: {
            const { token } = action.payload
            return { ...state, selectedToken: token }
        }
        case actionTypes.SET_TEMP_TOKENS: {
            const { tokens } = action.payload
            return { ...state, tempTokens: tokens }
        }

        default:
            return state
    }
}



export default uiConfig;



