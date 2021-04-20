import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { Button, makeStyles, TextField, Typography } from '@material-ui/core/';

import API from '../api/index';

import userStore from '../stores/userStore';

const LoginForm = observer(({ location }) => {
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const classes = useStyles();

  const handleSubmit = (e) => {
    e.preventDefault();

    API.post('/account/login', { ...form })
      .then((res) => {
        userStore.login(res.data.token);
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
  if (userStore.user) {
    return <Redirect to={from} />;
  }

  return (
    <div className={classes.loginPage}>
      <div className={classes.wrapper}>
        <form onSubmit={handleSubmit}>
          {/* title */}
          <div>
            <Typography variant="h5" component="h3">
              IMAGE VIEWER
            </Typography>
          </div>

          {/* Email field */}
          <TextField
            label="Email"
            type="text"
            className={classes.inputField}
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
            className={classes.inputField}
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
            className={classes.loginBtn}
            variant="outlined"
            color="primary"
          >
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
});

const useStyles = makeStyles(() => ({
  loginPage: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '110px',
  },
  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '300px',
    width: '100%',
    marginTop: '40px',
    padding: '0 12px',
  },
  inputField: {
    width: '100%',
    height: '50px',
    marginBottom: '20px',
    borderRadius: '3px',
    padding: '5px',
    fontSize: '0.875em',
  },
  loginBtn: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '5px',
    width: '100%',
    height: '20px',
  },
}));

export default LoginForm;
