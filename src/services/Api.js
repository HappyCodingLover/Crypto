import axios from 'axios';
export const api = (method, uri, params = null, data = null) => {

  return axios({
    method,
    url: `${uri}`,
    params,
    data
  });
};
