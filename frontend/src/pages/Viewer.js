import React, { useState, useEffect, useCallback } from 'react';

import Button from '@material-ui/core/Button';

import '../styles/Viewer.css';
import API from '../api/index';

import SideBar from '../components/SideBar';
import Tools from '../components/Tools';

function Viewer() {
  const baseURL = '/api/browse';
  const [mode, setMode] = useState('');
  const [activeFiles, setActiveFiles] = useState([]);
  const [objectURL, setObjectURL] = useState('');
  const [currentIdx, setCurrentIdx] = useState(
    activeFiles.length ? activeFiles.length - 1 : 0,
  );
  const [anchorIdx, setAnchorIdx] = useState(0);

  const increaseCurrentId = useCallback(() => {
    if (activeFiles.length > 0) {
      setCurrentIdx(Math.min(currentIdx + 1, activeFiles.length - 1));
    }
  }, [currentIdx, activeFiles]);

  const decreaseCurrentId = useCallback(() => {
    if (activeFiles.length > 0) {
      setCurrentIdx(Math.max(0, currentIdx - 1));
    }
  }, [currentIdx, activeFiles]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
        case 'ArrowDown':
          e.preventDefault();
          increaseCurrentId();
          break;

        case 'ArrowLeft':
        case 'ArrowUp':
          e.preventDefault();
          decreaseCurrentId();
          break;

        case ' ':
          e.preventDefault();
          setAnchorIdx(currentIdx);
          setCurrentIdx(0);
          break;

        default:
          return;
      }
    };

    const handleKeyUp = (e) => {
      if (e.key === ' ') {
        e.preventDefault();
        setCurrentIdx(anchorIdx);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [increaseCurrentId, decreaseCurrentId]);

  useEffect(() => {
    URL.revokeObjectURL(objectURL);

    if (activeFiles.length > 0) {
      API.get(`/browse${activeFiles[0].path}`, { responseType: 'blob' })
        .then((res) => {
          const objectURL = URL.createObjectURL(res.data);
          setObjectURL(objectURL);
        })
        .catch((e) => {
          throw e;
        });
    }
  }, [activeFiles, currentIdx]);

  const onActiveImageChanged = (dirEntry) => {
    /* 
      dirEntry = [
        {
          path: str,
          size: int,
          isDir: boolean,
          isActive : true
        }
    */
    const splitted = dirEntry.path.split('.');
    const extention = splitted[splitted.length - 1];
    if (extention !== 'png') return;

    switch (mode) {
      case 'Tools':
        if (dirEntry.isActive === true) {
          setActiveFiles([...activeFiles, dirEntry]);
        } else {
          const images = activeFiles
            .concat(dirEntry)
            .filter((image) => image.isActive === true);
          setActiveFiles(images);
        }
        break;

      default:
        setActiveFiles([dirEntry]);
    }
  };

  return (
    <div id="viewer">
      <div className="wrap">
        {/* Sidebar */}

        <div className="images__tree">
          <Button onClick={() => setMode(mode !== 'Tools' && 'Tools')}>
            History
          </Button>
          <SideBar
            onActiveImageChanged={onActiveImageChanged}
            baseURL={baseURL}
          />
        </div>

        {/* Image space */}
        <div className="images__viewer">
          {activeFiles.length > 0 && (
            <div className="imageWrap">
              {activeFiles.length > 0 && <img alt="이미지" src={objectURL} />}
            </div>
          )}
        </div>

        {/* tools space */}
        {mode === 'Tools' && (
          <div className="images__tools">
            <Tools
              activeFiles={activeFiles}
              setActiveFiles={setActiveFiles}
              currentIdx={currentIdx}
              setCurrentIdx={setCurrentIdx}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Viewer;
