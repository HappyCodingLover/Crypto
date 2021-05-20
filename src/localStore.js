export const loadState = () => {
  const jsonString = localStorage.getItem('state');
  if (jsonString === null) {
    return undefined;
  }
  const json = JSON.parse(jsonString);
  return {
    uiConfig:json.uiConfig
  };
};

export const saveState = state => {

  try {
    const toStore = {
        uiConfig: state.uiConfig,
    };

    const serial = JSON.stringify(toStore);
    localStorage.setItem('state', serial);

  } catch (err) {
    console.log(err);
  }
};
