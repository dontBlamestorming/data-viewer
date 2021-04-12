import React from 'react';
import { Route, Redirect } from 'react-router-dom';

function AuthRoute({ authenticated, component: Component, render, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) =>
        authenticated ? (
          render ? (
            render(props)
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
      }
    />
  );
}

export default AuthRoute;

/*
MobX working...

import { observer } from 'mobx-react-lite';
import { useStore } from '../stores/Context';
import { useStore } from './stores/Context';

const AuthRoute = observer(({ component: Component, render, ...rest }) => {
  const { authStore } = useStore();

  console.log('This is Auth Route');

  return (
    <Route
      {...rest}
      render={(props) =>
        authStore.authenticated ? (
          render ? (
            render(props)
          ) : (
            <Component {...props} />
          )
        ) : (
          <Redirect to={{ pathname: '/', state: { from: props.location } }} />
        )
      }
    />
  );
});

*/
