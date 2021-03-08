import React, { useState } from 'react';

import { Route, Switch } from 'react-router-dom';

// Styles
import './styles/App.css';

// componenet
import AuthRoute from './components/AuthRoute';
// import SideMenu from './components/SideMenu';

// pages
import LoginForm from './pages/LoginForm';
import Viewer from './pages/Viewer';

import Test from './pages/Test';

function App() {
  const [user, setUser] = useState(null);
  const authenticated = user !== null;

  // const processLogin = (user) => setUser(user);

  return (
    <Switch>
      <Route
        exact
        path="/"
        render={(props) => (
          <Test />
          // <SideMenu />
          // <Viewer />
          // <LoginForm
          //   authenticated={authenticated}
          //   setUser={setUser}
          //   {...props}
          // />
        )}
      />

      {/* <AuthRoute
        authenticated={authenticated}
        path="/viewer"
        render={(props) => <Viewer user={user} {...props} />}
      /> */}
    </Switch>
  );
}

export default App;
