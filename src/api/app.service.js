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
  async (error) => {
    if (error.response.status === 401) {
      return getToken()
        .then((data) => {
          if (data.auth) {
            const { config } = error;
            config.headers.Authorization = `Bearer ${data.token}`;

            return new Promise((resolve) => {
              axios.request(config).then((response) => {
                resolve(response);
              });
            });
          }
          // eslint-disable-next-line
          return data;
        })// eslint-disable-next-line
        .catch((error) => console.log(error));
    }
    return Promise.reject(error.response);
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
