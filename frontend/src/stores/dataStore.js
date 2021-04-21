import { makeAutoObservable } from 'mobx';
import API from '../api/index';

const compareByLocale = (a, b) => {
  const _a = a.path;
  const _b = b.path;

  return _a.localeCompare(_b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

const compareByIsDir = (a, b) => b.isDir - a.isDir;

const sortedDirEntries = (dirEntries) => {
  dirEntries.sort((a, b) => {
    const compareIsDir = compareByIsDir(a, b);
    const compareLocale = compareByLocale(a, b);

    return compareIsDir || compareLocale;
  });

  return dirEntries;
};

class DataStore {
  /* 
    dirEntry = [
      {
        path: str,
        size: int,
        isDir: boolean,
        isActive : dirEntry
      }
  */
  dirEntries = [];
  activeFile = {};

  constructor() {
    makeAutoObservable(this);
  }

  async initData() {
    this.dirEntries = [];
    await this.fetchDirEntries();
  }

  async fetchDirEntries(dirEntry) {
    try {
      const response = await API.get(`/browse${dirEntry ? dirEntry.path : ''}`);
      const dirEntries = response.data.map((item) => ({
        path: item.path,
        size: item.size,
        isDir: item.isDir,
        parent: dirEntry,
      }));
      const result = sortedDirEntries(dirEntries);

      if (dirEntry) {
        dirEntry.dirEntries = result;
        dirEntry.isFetched = true;
      } else {
        this.dirEntries = result;
      }
    } catch (e) {
      throw e;
    }
  }

  onActiveImageChanged(dirEntry) {
    this.activeFile = dirEntry;
  }
}

const dataStore = new DataStore();

export default dataStore;
