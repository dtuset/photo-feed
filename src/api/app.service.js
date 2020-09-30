import axios from 'axios';
import appConfig from '../../appConfig';

axios.defaults.baseURL = 'http://interview.agileengine.com';
axios.defaults.timeout = 5000; // 5 secs

axios.interceptors.request.use(
  (config) => {
    const newConf = config;
    const token = window.localStorage.getItem('token');
    if (token) {
      newConf.headers.Authorization = `Bearer ${token}`;
    }
    return newConf;
  },
  (error) => {
    Promise.reject(error);
  },
);

function getToken() {
  return new Promise((resolve, reject) => {
    axios.post('/auth', appConfig.clientKey)
      .then((response) => {
        window.localStorage.setItem('token', response.data.token);
        resolve(response.data);
      }).catch((error) => {
        reject(error);
      });
  });
}

axios.interceptors.response.use(
  (response) => response,
  async (error) => { // eslint-disable-next-line
    if (error.response.status === 401) {
      if (error.config.url === '/auth') {
        return Promise.reject(error);
      }
      // eslint-disable-next-line
      if (!error.config._retry) {
        // eslint-disable-next-line
        error.config._retry = true;
        return getToken()
          .then((data) => {
            if (data.auth) {
              const { config } = error;
              config.headers.Authorization = `Bearer ${data.token}`;
              return axios.request(config);
            }
            return '';
          });
      }
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);

const appService = {
  get(url) {
    return new Promise((resolve, reject) => {
      axios.get(url)
        .then((response) => {
          resolve(response.data);
        }).catch((error) => {
          reject(error);
        });
    });
  },
};

export default appService;
