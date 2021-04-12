import React, { useEffect, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, TextField, Typography } from '@material-ui/core/';
import '../styles/LoginForm.css';

import API from '../api/index';

export default function LoginForm({ authenticated, login, location }) {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    API.post('/account/login', { ...form })
      .then((res) => {
        login(res.data.token);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert('잘못된 계정 정보입니다.');
          setForm({
            email: '',
            password: '',
          });
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
              setForm({
                ...form,
                email: e.target.value,
              });
            }}
          />

          {/* Password field */}
          <TextField
            label="Password"
            type="password"
            className="inputLast"
            onChange={(e) => {
              setForm({
                ...form,
                password: e.target.value,
              });
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
}

/*
MobX working...

// import { useStore } from '../stores/Context';
import AuthStore from '../stores/AuthStore';

const authStore = new AuthStore();

const LoginForm = observer(({ location }) => {
  // const { authStore } = useStore();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });

  const onSubmit = (e) => {
    e.preventDefault();

    API.post('/account/login', form)
      .then((response) => {
        const freshToken = response.data.token;

        authStore.login(freshToken);
      })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          alert('이메일 또는 비밀번호를 확인해주세요.');
          setForm({
            email: '',
            password: '',
          });
        } else {
          console.log(error);
        }
      });
  };

  return (
    <>
      <div className="login-page">
        <div className="input-wrapper">
          <form onSubmit={onSubmit}>
            <div className="login-title-box">
              <Typography variant="h5" component="h3">
                IMAGE VIEWER
              </Typography>
            </div>

            <TextField
              label="Email"
              type="text"
              className="inputFirst"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <TextField
              label="Password"
              type="password"
              className="inputLast"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />

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
    </>
  );
});

export default LoginForm;


*/
