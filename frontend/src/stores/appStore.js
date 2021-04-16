import { makeAutoObservable } from 'mobx';

class AppStore {
  mobileOpen = false;
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  setLoading(bool) {
    this.isLoading = bool;
  }

  setMobileOpen() {
    this.mobileOpen = !this.mobileOpen;
  }
}

const appStore = new AppStore();

export default appStore;
