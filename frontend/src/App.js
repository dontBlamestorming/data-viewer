import React, { useCallback, useEffect, useState } from 'react';

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

/*

Mobx Working ...

import API from './api/index';
// import { useStore } from './stores/Context';
import { observer } from 'mobx-react-lite';
// import AuthStore from './stores/AuthStore';
import {
  isAction,
  isObservable,
  toJS,
  isObservableProp,
  makeAutoObservable,
  runInAction,
} from 'mobx';
// const authStore = new AuthStore();
// const { userStore, authStore } = useStore();
class AuthStore {
  TOKEN_KEY = 'auth_token';
  storage = sessionStorage;
  authenticated = false;
  secondsPassed = 0;

  constructor() {
    makeAutoObservable(this);
  }

  increase() {
    this.secondsPassed += 1;
  }

  async login(token) {
    try {
      const response = await API.get('/account/profile', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });
      runInAction(() => {
        // this.rootStore.userStore.user = response.data;
        // this.authenticated = this.rootStore.userStore.user !== null;
        this.authenticated = true;
        console.log(this.authenticated);
        this.storage.setItem(this.TOKEN_KEY, token);
        API.setAuthInterceptor(token, this.logout);
      });
    } catch (error) {
      runInAction(() => {
        throw error;
      });
    }
  }

  logout() {
    API.clearAuthInterceptor();
    this.storage.removeItem(this.TOKEN_KEY);
    this.rootStore.userStore.user = null;
  }
}

const authStore = new AuthStore();

const App = observer(() => {
  console.log('This is App');
  // console.log(authStore.secondsPassed);
  const [isLoaded, setIsLoaded] = useState(false);
  // console.log('isAction', isAction(authStore.login));

  useEffect(() => {
    // setInterval(() => {
    //   authStore.increase();
    // }, 1000);

    console.log('is this read?');
    // authStore.authenticated = userStore.user !== null;
    const token = authStore.storage.getItem(authStore.TOKEN_KEY);

    if (token) {
      authStore
        .login(token)
        .catch((error) => authStore.storage.removeItem(authStore.TOKEN_KEY))
        .finally(() => {
          setIsLoaded(true);
        });
    } else {
      setIsLoaded(true);
    }
  }, []);

  return (
    <div className="App">
      <Header />
      {isLoaded ? (
        <Switch>
          <Route exact path="/" render={(props) => <LoginForm {...props} />} />

          <AuthRoute path="/viewer" render={(props) => <Viewer {...props} />} />
        </Switch>
      ) : (
        <span>로딩중...</span>
      )}
    </div>
  );
});

export default App;

*/
