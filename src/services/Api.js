import env from '../env';
import axios from 'axios';

export const api = (method, uri, params = null, data = null) => {

  return axios({
    method,
    url: `${env.API_PATH}${uri}`,
    params,
    data
  });
};
