import React, { useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { Route, Switch } from 'react-router-dom';

import './styles/App.css';

import LoginForm from './pages/LoginForm';
import Viewer from './pages/Viewer';

import AuthRoute from './components/AuthRoute';
import Header from './components/Header';

import Loading from './components/Loading';

import appStore from './stores/appStore';
import userStore from './stores/userStore';

const App = observer(() => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    userStore.restore(() => {
      setTimeout(() => setInitialized(true), 100);
    });
  }, []);

  return !initialized ? (
    <Loading />
  ) : (
    <div className="App">
      <Header mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <Switch>
        <Route exact path="/" render={(props) => <LoginForm {...props} />} />

        <AuthRoute
          path="/viewer"
          render={(props) => (
            <Viewer
              mobileOpen={mobileOpen}
              setMobileOpen={setMobileOpen}
              {...props}
            />
          )}
        />
      </Switch>
      {appStore.isLoading && <Loading />}
    </div>
  );
});

export default App;
