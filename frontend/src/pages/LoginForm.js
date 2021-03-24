import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

import { Button, TextField, Typography } from '@material-ui/core/';

import '../styles/LoginForm.css';

import API from '../api/index';

const LoginForm = ({ authenticated, setUser, location }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    API.post('/login', { email, password })
      .then((res) => {
        const token = res.data.token;

        API.setAuthToken(token);
        setUser(true);
      })
      .catch((error) => {
        if (!error.response) {
        } else if (error.response.status === 401) {
          alert('잘못된 계정 정보입니다.');
          setEmail('');
          setPassword('');
        } else {
          console.log(error);
        }
      });
  };

  const { from } = location.state || { from: { pathname: '/viewer' } };
  if (authenticated) {
    return <Redirect to={from} />;
  }

  return (
    <div className="login-page">
      <div className="input-wrapper">
        <form onSubmit={handleSubmit}>
          {/* title */}
          <div className="login-title-box">
            <Typography variant="h5" component="h3">
              IMAGE VIEWER
            </Typography>
          </div>

          {/* Email field */}
          <TextField
            label="Email"
            type="text"
            className="inputFirst"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />

          {/* Password field */}
          <TextField
            label="Password"
            type="password"
            className="inputLast"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />

          {/* Log-in Btn */}
          <Button
            type="submit"
            className="loginBttn"
            variant="outlined"
            color="primary"
          >
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
};
export default LoginForm;
