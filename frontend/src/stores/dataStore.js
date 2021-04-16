import { makeAutoObservable, runInAction, toJS } from 'mobx';
import API from '../api/index';

class DataStore {
  dirEntries = [];
  activeFile = [];

  constructor() {
    makeAutoObservable(this);
  }

  async initializeData() {
    const dirEntries = await this.fetchDirEntries();

    runInAction(() => (this.dirEntries = dirEntries));
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
  }
}

const dataStore = new DataStore();

export default dataStore;
