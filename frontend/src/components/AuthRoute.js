import React from 'react';
import { Route, Redirect, useLocation } from 'react-router-dom';

import { observer } from 'mobx-react-lite';

import userStore from '../stores/userStore';

const AuthRoute = observer((props) => {
  const location = useLocation();

  return !userStore.user ? (
    <Redirect to={{ pathname: '/', state: { from: location } }} />
  ) : (
    <Route {...props} />
  );
});

export default AuthRoute;
