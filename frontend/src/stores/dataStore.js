import { makeAutoObservable, toJS, autorun } from 'mobx';
import API from '../api/index';

class DataStore {
  state = { dirEntries: [] };
  activeFile = [];
  activeTextFile = '';
  objectImageURL = null;

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

  setActiveFile(activeFile) {
    this.activeFile = activeFile;
  }

  setObjectImageURL(objectURL) {
    this.objectImageURL = objectURL;
    console.log('setObjectImageURL', toJS(this.objectImageURL));
  }

  setActiveTextFile(text) {
    this.activeTextFile = text;
    console.log('activeTextFile', this.activeFile);
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

  loadDataSources() {
    URL.revokeObjectURL(this.objectImageURL);

    API.get(`/browse${this.activeFile[0].path}`, {
      responseType: 'blob',
    })
      .then((res) => {
        if (res.data.type === 'text/plain') {
          res.data.text((text) => {
            this.setActiveTextFile(text);
            this.setObjectImageURL(null);
          });
        } else {
          const objectURL = URL.createObjectURL(res.data);
          this.setObjectImageURL(objectURL);
          this.setActiveTextFile(null);
        }
      })
      .catch((e) => {
        throw e;
      });
  }
}

const dataStore = new DataStore();

export default dataStore;
