import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';

// material ui
import { Button, TextField, Typography } from '@material-ui/core/';

// css
import '../styles/LoginForm.css';

// auth
import { logIn } from '../api/auth';

const LoginForm = ({ authenticated, setUser, location }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      logIn({ email, password, setUser });
    } catch (e) {
      alert('Failed to login');
      setEmail('');
      setPassword('');
    }
  };

  const { from } = location.state || { from: { pathname: '/viewer' } };
  if (authenticated) return <Redirect to={from} />;

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
