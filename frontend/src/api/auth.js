import axios from 'axios';

export const logIn = ({ email, password, setUser }) => {
  const API = '/account/login/';

  axios
    .post(API, { email, password })
    .then((res) => {
      localStorage.setItem('userToken', JSON.stringify(res.data.access));
      setUser(true);
    })
    .catch((error) => {
      console.error('Error', error);
    });
};
