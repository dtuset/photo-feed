import axios from 'axios';
// import { cacheAdapterEnhancer } from 'axios-extensions';
import appConfig from '../../appConfig';

axios.defaults.baseURL = 'http://interview.agileengine.com';
axios.defaults.timeout = 5000; // 5 secs

axios.interceptors.request.use(
  (config) => {
    const newConf = config;
    // if (typeof window === 'undefined') {
    //   return newConf;
    // }
    const token = window.localStorage.getItem('token');
    if (token) {
      newConf.headers.Authorization = `Bearer ${token}`;
    }
    return newConf;
  },
  (error) => {
    // eslint-disable-next-line
    console.log(error);
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
  getToken() {
    return new Promise((resolve, reject) => {
      axios.post('/auth', appConfig.clientKey)
        .then((response) => {
          window.localStorage.setItem('token', response.data.token);
          resolve(response.data);
        }).catch((error) => {
          reject(error);
        });
    });
  },
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      return appService.getToken()
        .then((data) => {
          // const token = window.localStorage.getItem('token');
          if (data.auth) {
            // originalRequest.headers.Authorization = `Bearer ${data.token}`;
            // window.localStorage.setItem('token', data.token);
            // New request with new token
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
  //   if (response.status === 200 || response.status === 201) {
  //     return Promise.resolve(response);
  //   }
  //   return Promise.reject(response);
  // },
  // (error) => {
  //   if (error.response.status) {
  //     switch (error.response.status) {
  //       case 400:
  //         // do something
  //         break;
  //       case 401:
  //         this.getToken();
  //         break;
  //       case 403:
  //         // do sthg
  //         break;
  //       case 404:
  //         // eslint-disable-next-line
  //         alert('page not exist');
  //         break;
  //       case 502:
  //         // do sthg
  //         break;
  //       default:
  //         break;
  //     }
  //   }
  //   return Promise.reject(error.response);
);

export default appService;
