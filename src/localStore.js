import { fromJS } from 'immutable';

export const loadState = () => {
  const jsonString = localStorage.getItem('state');
  if (jsonString === null) {
    return undefined;
  }
  const json = JSON.parse(jsonString);
  return {
    appReducer: fromJS(json.appReducer),
  };
};

export const saveState = state => {

  try {
    const toStore = {
        appReducer: state.appReducer,
    };

    const serial = JSON.stringify(toStore);
    localStorage.setItem('state', serial);

  } catch (err) {
    console.log(err);
  }
};
