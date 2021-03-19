import React, { useState } from 'react';

import { Route, Switch } from 'react-router-dom';

import './styles/App.css';

import LoginForm from './pages/LoginForm';
import Viewer from './pages/Viewer';
import AuthRoute from './components/AuthRoute';

function App() {
  const [user, setUser] = useState(null);
  const authenticated = user != null;
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
        render={(props) => <Viewer user={user} {...props} />}
      />
    </Switch>
  );
}

export default App;
