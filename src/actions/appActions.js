import actionTypes from './actionTypes';

export const updateTheme = theme => ({
  type: actionTypes.THEME_UPDATE,
  payload: { theme }
});
export const setIsMobile = isMobileWidth => ({
    type: actionTypes.IS_MOBILE,
    payload: { isMobileWidth }
});
export const openProvierMenu = status =>({
    type: actionTypes.OPEN_PROVIDER_MENU,
    payload: { status }
});
