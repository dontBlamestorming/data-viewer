import { makeAutoObservable } from 'mobx';
import API from '../api/index';

class DataStore {
  state = { dirEntries: [] };
  expanded = ['root'];

  constructor() {
    makeAutoObservable(this);
  }

  async initializeData() {
    const dirEntries = await this.fetchDirEntries();
    this.state = { ...this.state, dirEntries };
  }

  async fetchDirEntries(dirEntry) {
    try {
      const res = await API.get(`/browse${dirEntry ? dirEntry.path : ''}`);

      return res.data.map((item) => ({
        path: item.path,
        size: item.size,
        isDir: item.isDir,
        parent: dirEntry,
      }));
    } catch (e) {
      throw e;
    }
  }

  setExpanded(expandedId) {
    this.expanded = expandedId;
  }

  setState(state) {
    this.state = state;
  }

  setActivedDirEnrty(dirEntry) {
    this.activedDirEntry = dirEntry;
  }

  async onClickDirectory(dirEntry) {
    dirEntry.dirEntries = await this.fetchDirEntries(dirEntry);
    dirEntry.isFetched = true;
    dirEntry.open = !dirEntry.open;

    this.setState({ ...this.state });
  }
}

const dataStore = new DataStore();

export default dataStore;
