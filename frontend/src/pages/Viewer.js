import React, { useState, useEffect, useCallback } from 'react';

import Button from '@material-ui/core/Button';

import styled from 'styled-components';

import '../styles/Viewer.css';
import API from '../api/index';

import SideBar from '../components/SideBar';
import Tools from '../components/Tools';
import { MapInteraction } from 'react-map-interaction';

// const initialState = {
//   zoom: {
//     container: {
//       width: 0,
//       height: 0,
//     },
//     image: {
//       width: 0,
//       height: 0,
//     },
//     minScale: 1,
//     scale: 1,
//     translation: {
//       x: 0,
//       y: 0,
//     },
//   },
// };

export default function Viewer() {
  const baseURL = '/api/browse';
  const [mode, setMode] = useState('Default');
  const [activeFiles, setActiveFiles] = useState([]);
  const [objectURL, setObjectURL] = useState('');
  const [currentIdx, setCurrentIdx] = useState(
    activeFiles.length ? activeFiles.length - 1 : 0,
  );
  const [anchorIdx, setAnchorIdx] = useState(0);
  // const [state, setState] = useState(initialState);

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
            mode={mode}
          />
        </div>

        {/* Image space */}
        <div className="images__viewer">
          {activeFiles.length > 0 && (
            <div className="images__wrap">
              {activeFiles.length > 0 && (
                // <Zoom src={objectURL} />

                <MapInteraction>
                  {({ translation, scale }) => {
                    console.log(translation, scale);

                    return (
                      <Container>
                        <ImageWrapper
                          translation={{
                            x: translation.x,
                            y: translation.y,
                          }}
                          scale={scale}
                        >
                          <img
                            alt="이미지"
                            src={objectURL}
                            style={{ position: 'relative' }}
                          />
                        </ImageWrapper>
                      </Container>
                    );
                  }}
                </MapInteraction>
              )}
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

const Container = styled.div`
  width: 100%;
  height: 100%;
  position: relative;
  overflow: hidden;

  cursor: grab;
  touch-action: none;
  -ms-touch-action: none;

  user-select: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  -webkit-touch-callout: none;
`;

const ImageWrapper = styled.div.attrs((props) => ({
  style: {
    transform: `translate(${props.translation.x}px, ${props.translation.y}px) scale(${props.scale})`,
  },
}))`
  display: inline-block;
  transformorigin: '0 0 ';
  position: relative;
`;
