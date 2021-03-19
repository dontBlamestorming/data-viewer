import axios from 'axios';

export const logIn = ({ email, password, setUser }) => {
  const API = 'http://localhost:8000/account/login/';

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
