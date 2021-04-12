import {
  action,
  flow,
  makeObservable,
  makeAutoObservable,
  observable,
  isObservable,
  isAction,
  toJS,
  runInAction,
} from 'mobx';
import API from '../api/index';

class AuthStore {
  // rootStore;

  TOKEN_KEY = 'auth_token';
  storage = sessionStorage;
  authenticated = {
    apple: '사과',
  };
  secondsPassed = 0;

  constructor() {
    makeAutoObservable(this);

    // makeObservable(this, {
    //   authenticated: observable,
    //   TOKEN_KEY: observable,
    //   secondsPassed: observable,
    //   login: action,
    //   logout: action,
    //   increaseTimer: action,
    // });

    // this.rootStore = root;
  }

  increaseTimer() {
    this.secondsPassed += 1;
    console.log('!!');
  }

  // login = flow(function* (token) {
  //   try {
  //     const response = yield API.get('/account/profile', {
  //       headers: {
  //         Authorization: `Token ${token}`,
  //       },
  //     });
  //     // this.rootStore.userStore.user = response.data;
  //     // this.authenticated = this.rootStore.userStore.user !== null;
  //     this.authenticated = { apple: '바나나' };
  //     console.log(toJS(this.authenticated));
  //     this.storage.setItem(this.TOKEN_KEY, token);
  //     API.setAuthInterceptor(token, this.logout);
  //   } catch (error) {
  //     throw error;
  //   }
  // });

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
        this.authenticated.apple = '바나나';
        this.authenticated = { apple: '바나나' };
        console.log(toJS(this.authenticated));

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

export default AuthStore;
