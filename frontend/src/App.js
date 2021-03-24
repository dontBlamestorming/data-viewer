import React, { useEffect, useState } from 'react';

import { Route, Switch } from 'react-router-dom';

import './styles/App.css';

import LoginForm from './pages/LoginForm';
import Viewer from './pages/Viewer';

import AuthRoute from './components/AuthRoute';

import API from './api/index';

function App() {
  const [user, setUser] = useState(null);
  const authenticated = user != null;

  useEffect(() => {
    const token = API.getAuthToken();
    if (token) {
      setUser(true);
    }
  }, []);

  return (
    <Switch>
      <Route
        exact
        path="/"
        render={(props) => (
          <LoginForm
            authenticated={authenticated}
            setUser={setUser}
            {...props}
          />
        )}
      />

      <AuthRoute
        authenticated={authenticated}
        path="/viewer"
        render={(props) => (
          <Viewer user={user} authenticated={authenticated} {...props} />
        )}
      />
    </Switch>
  );
}

export default App;
