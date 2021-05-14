import mirrorCreator from 'mirror-creator';
const actionTypes = mirrorCreator([
  'WALLET_CONNECTED',
  'THEME_UPDATE',
  'IS_MOBILE',
  'OPEN_PROVIDER_MENU',
  'SET_SELECTED_TOKEN'
]);
export default actionTypes;
