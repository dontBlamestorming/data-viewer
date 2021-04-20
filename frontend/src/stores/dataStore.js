import { makeAutoObservable, toJS } from 'mobx';
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

/*
    dirEntry.isActive = !dirEntry.isActive;
    if (dirEntry.isActive === true) {
      this.dirEntries = [dirEntry];
      this.activeFile = dirEntry;
    } else {
      const images = this.activeFile
        .concat(dirEntry)
        .filter((image) => image.isActive === true);
    }

    activefile을 배열로 여러개 모아놓는다고 가정하자 -> 2~3개 클릭해서 active상태로 만들어놓고 키로 컨트롤 할 수 있지
    근데 그게 별로 필요가 없다고 하셨음

    그렇다면? 최적화?문제는 지금은 끝났고 activefile을 전체로 관리할 필요가 있는가? 노노
*/
