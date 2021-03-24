import axios from 'axios';

const API = axios.create({
  baseURL: '/account',
});

const AUTH_TOKEN_KEY = 'AUTH_TOKEN';

API.getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);
API.setAuthToken = (token) => localStorage.setItem(AUTH_TOKEN_KEY, token);
API.removeAuthToken = () => localStorage.removeItem(AUTH_TOKEN_KEY);

API.interceptors.request.use(
  (config) => {
    setAuthorization(config);
    setURLTrailingSlash(config);

    console.log('Before Req', config);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

API.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      API.removeAuthToken();
    }
    return Promise.reject(error);
  },
);

const setAuthorization = (config) => {
  const authToken = API.getAuthToken();

  if (authToken) {
    config.header.Authorization = `Token ${authToken}`;
  }
};

const setURLTrailingSlash = (config) => {
  if (!config.url.endsWith('/')) {
    config.url = `${config.url}/`;
  }
};

export default API;
