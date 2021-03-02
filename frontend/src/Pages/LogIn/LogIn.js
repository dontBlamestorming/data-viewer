import React, { useState } from 'react';

import './LogIn.css';
import Button from '@material-ui/core/Button';
import axios from 'axios';

const LogIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

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
          onClick={() => {}}
          variant="outlined"
          color="primary"
        >
          LogIn
        </Button>
      </div>
    </div>
  );
};
export default LogIn;
