import React from 'react';

import { Route, Switch } from 'react-router-dom';

// Styles
import './styles/App.css';

// pages
import Viewer from './pages/Viewer';

function App() {
  return (
    <Switch>
      <Route
        exact
        path="/"
        render={(props) => (
          <>
            <Viewer />
          </>
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
