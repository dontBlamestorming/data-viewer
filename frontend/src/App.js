import React, { useEffect, useState } from 'react';

import { Route, Switch } from 'react-router-dom';

import './styles/App.css';

import LoginForm from './pages/LoginForm';
import Viewer from './pages/Viewer';

import AuthRoute from './components/AuthRoute';
import Header from './components/Header';

import API from './api/index';

const TOKEN_KEY = 'auth_token';
const storage = sessionStorage;

function App() {
  const [user, setUser] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const authenticated = user !== null;

  const login = async (token) => {
    try {
      const res = await API.get('/account/profile', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      API.setAuthInterceptor(token, logout);
      storage.setItem(TOKEN_KEY, token);
      setUser(res.data);
    } catch (e) {
      throw e;
    }
  };

  const logout = () => {
    API.clearAuthInterceptor();
    storage.removeItem(TOKEN_KEY);
    setUser(null);
  };

  useEffect(() => {
    const token = storage.getItem(TOKEN_KEY);
    if (token) {
      login(token)
        .catch((e) => storage.removeItem(TOKEN_KEY))
        .finally(() => setIsLoaded(true));
    } else {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div className="App">
      <Header
        user={user}
        authenticated={authenticated}
        logout={logout}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      {isLoaded ? (
        <Switch>
          <Route
            exact
            path="/"
            render={(props) => (
              <LoginForm
                authenticated={authenticated}
                login={login}
                {...props}
              />
            )}
          />

          <AuthRoute
            authenticated={authenticated}
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
      ) : (
        <span>로딩중...</span>
      )}
    </div>
  );
}

export default App;
