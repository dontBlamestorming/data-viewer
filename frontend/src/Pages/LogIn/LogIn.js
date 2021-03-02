import React, { useState } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

import './LogIn.css';
import Button from '@material-ui/core/Button';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState('');

  // const API = 'http://localhost:8080/';
  const MockAPI = 'https://reqres.in/';
  const history = useHistory();

  const onClickLogin = () => {
    return axios
      .post(MockAPI + 'api/login', {
        email,
        password,
      })
      .then((response) => {
        if (response.data.token) {
          localStorage.setItem(
            'usertoken',
            JSON.stringify(response.data.token),
          );
          history.push('/');
        }

        return response.data;
      });
  };

  return (
    <div className="login-page">
      <div className="input-wrapper">
        <div className="login-title-box">
          <h1>LogIn</h1>
        </div>
        <div className="firstName">email</div>
        <input
          type="text"
          className="inputFirst"
          placeholder="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="lastName">pw</div>
        <input
          type="text"
          className="inputLast"
          placeholder="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button
          className="loginBttn"
          onClick={() => {
            onClickLogin();
          }}
          variant="outlined"
          color="primary"
        >
          LogIn
        </Button>
        {msg}
      </div>
    </div>
  );
};
export default LogIn;
