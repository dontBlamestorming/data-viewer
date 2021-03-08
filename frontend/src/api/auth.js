import axios from 'axios';

export const logIn = ({ email, password, setUser }) => {
  const API = 'http://localhost:8080/account/login/';

  axios
    .post(API, { email, password })
    .then((res) => {
      // res가 정상적으로 동작한다면 res.data.access가 100% 온다는 보장이 있는가?
      localStorage.setItem('userToken', JSON.stringify(res.data.access));
      setUser(true);
    })
    .catch((error) => {
      // 1. 서버가 죽은 경우 -> Network Error
      // 2. email 또는 password가 유효하지 않은 경우 -> Request failed with status code 401
      console.error('Error', error);
    });
};
