import { makeAutoObservable } from 'mobx';

class ZoomStore {
  zoomState = {
    scale: 1,
    translation: { x: 0, y: 0 },
    container: { width: 0, height: 0 },
  };

  constructor() {
    makeAutoObservable(this);
  }

  setZoomState({ scale, translation }) {
    const newZoomState = {
      ...this.zoomState,
      scale,
      translation,
    };

    this.zoomState = newZoomState;
  }

  resetZoomState() {
    const translation = { x: 0, y: 0 };

    this.zoomState = {
      ...this.zoomState,
      translation,
    };
  }
}

const zoomStore = new ZoomStore();

export default zoomStore;
