import { makeAutoObservable } from 'mobx';

class AppStore {
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(bool) {
    this.isLoading = bool;
  }
}

const appStore = new AppStore();

export default appStore;
