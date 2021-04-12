import { makeAutoObservable } from 'mobx';
import API from '../api/index';

import appStore from './appStore';

const TOKEN_KEY = 'AUTH_TOKEN';
const storage = sessionStorage;

class UserStore {
  user = null;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  async login(token) {
    appStore.setLoading(true);
    try {
      const res = await API.get('/account/profile', {
        headers: {
          Authorization: `Token ${token}`,
        },
      });

      API.setAuthInterceptor(token, this.logout);
      storage.setItem(TOKEN_KEY, token);

      this.user = res.data;
    } catch (e) {
      throw e;
    }
    appStore.setLoading(false);
  }

  logout() {
    API.clearAuthInterceptor();
    storage.removeItem(TOKEN_KEY);

    this.user = null;
  }

  restore(callback) {
    const token = storage.getItem(TOKEN_KEY);
    if (token) {
      this.login(token)
        .catch((e) => storage.removeItem(TOKEN_KEY))
        .finally(callback);
    }
    callback();
  }
}

const userStore = new UserStore();

export default userStore;
