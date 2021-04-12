import { makeAutoObservable } from 'mobx';
import API from '../api/index';

export class UserStore {
  rootStore;
  user = null;
  mobileOpen = false;

  constructor(root) {
    makeAutoObservable(this);

    this.rootStore = root;
  }
}
