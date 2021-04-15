import { makeAutoObservable, toJS, autorun } from 'mobx';
import API from '../api/index';

class DataStore {
  state = { dirEntries: [] };
  activeFile = [];
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

  setState(state) {
    this.state = state;
  }

  setActiveFiles(activeFile) {
    this.activeFile = activeFile;
    console.log(this);
    console.log(toJS(this.activeFile));
  }

  onActiveImageChanged(dirEntry) {
    if (dirEntry.isActive === true) {
      this.setActiveFiles([dirEntry]);
    } else {
      const images = this.activeFile
        .concat(dirEntry)
        .filter((image) => image.isActive === true);
      this.setActiveFiles(images);
    }
  }
}

const dataStore = new DataStore();

// autorun(() => {
//   if (dataStore.isThereSomething) {
//     console.log('Hello! I am Auto Run!!!');
//   } else {
//     console.log('?????????/');
//   }
// });

export default dataStore;
