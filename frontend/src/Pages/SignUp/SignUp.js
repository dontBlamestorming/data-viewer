import React, { useState } from 'react';
import axios from 'axios';

import './SignUp.css';
import Button from '@material-ui/core/Button';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const onSubmitSignUp = (e) => {
    e.preventDefault();
    if (email && password) {
      axios({
        method: 'post',
        url: '',
        data: {
          email,
          password,
        },
      })
        .then(() => {
          alert('Dd');
        })
        .catch(() => {
          alert('dddddddd');
        });
    }
  };
  return (
    <div className="signup-page">
      <div className="input-wrapper">
        <div className="signup-title-box">
          <h1>Sign up</h1>
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
          className="signUpBttn"
          onClick={() => {
            onSubmitSignUp();
          }}
          variant="outlined"
          color="primary"
        >
          sign up
        </Button>
      </div>
    </div>
  );
};
export default SignUp;
