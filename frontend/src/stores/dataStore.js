import { makeAutoObservable, runInAction, toJS } from 'mobx';
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
  dirEntries = [];
  activeFile = [];

  constructor() {
    makeAutoObservable(this);
  }

  async initData() {
    this.dirEntries = [];
    await this.fetchDirEntries();
  }

  async fetchDirEntries(dirEntry) {
    try {
      const res = await API.get(`/browse${dirEntry ? dirEntry.path : ''}`);

      const result = sortedDirEntries(
        res.data.map((item) => ({
          path: item.path,
          size: item.size,
          isDir: item.isDir,
          parent: dirEntry,
        })),
      );

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

  setDirEntries(dirEntry) {
    this.dirEntries = dirEntry;
  }

  // setState(state) {
  //   this.state = state;
  // }

  setActiveFile(activeFile) {
    this.activeFile = activeFile;
  }

  setActiveTextFile(text) {
    this.activeTextFile = text;
  }

  onActiveImageChanged(dirEntry) {
    /* 
      dirEntry = [
        {
          path: str,
          size: int,
          isDir: boolean,
          isActive : true
        }
    */
    if (dirEntry.isActive === true) {
      this.setActiveFile([dirEntry]);
    } else {
      const images = this.activeFile
        .concat(dirEntry)
        .filter((image) => image.isActive === true);
      this.setActiveFile(images);
    }
    dirEntry.isActive = !dirEntry.isActive;
  }
}

const dataStore = new DataStore();

export default dataStore;
