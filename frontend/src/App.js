import React, { useEffect, useState } from 'react';

import { observer } from 'mobx-react-lite';
import { Route, Switch } from 'react-router-dom';

import LoginForm from './pages/LoginForm';
import Viewer from './pages/Viewer';

import Header from './components/Header';
import AuthRoute from './components/AuthRoute';
import Loading from './components/Loading';

import appStore from './stores/appStore';
import userStore from './stores/userStore';

const App = observer(() => {
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    userStore.restore(() => setTimeout(() => setInitialized(true), 100));
  }, []);

  return !initialized ? (
    <Loading />
  ) : (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/" render={(props) => <LoginForm {...props} />} />
        <AuthRoute path="/viewer" render={(props) => <Viewer {...props} />} />
      </Switch>
      {appStore.isLoading && <Loading />}
    </div>
  );
});

export default App;
