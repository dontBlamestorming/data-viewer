import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

API.interceptors.request.use(
  (config) => {
    if (!config.url.endsWith('/')) {
      config.url = `${config.url}/`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

const authInterceptor = {};

API.setAuthInterceptor = (token, logout) => {
  authInterceptor.req = API.interceptors.request.use((config) => {
    config.headers.Authorization = `Token ${token}`;
    return config;
  });

  authInterceptor.res = API.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        logout();
      }
      return Promise.reject(error);
    },
  );
};

API.clearAuthInterceptor = () => {
  API.interceptors.request.eject(authInterceptor.req);
  API.interceptors.response.eject(authInterceptor.res);
};

export default API;
