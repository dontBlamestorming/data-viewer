import React, { useState, useEffect, useCallback, useRef } from 'react';

import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import SideBar from '../components/SideBar';
import Tools from '../components/Tools';

import { MapInteractionCSS } from 'react-map-interaction';

import API from '../api/index';
import '../styles/Viewer.css';

const initaiState = {
  scale: 1,
  translation: { x: 0, y: 0 },
  container: { width: 0, height: 0 },
  translationBounds: {
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
  },
  imgCon: {
    width: 0,
    height: 0,
  },
};

export default function Viewer() {
  const baseURL = '/api/browse';
  const [mode, setMode] = useState('Default');
  const [activeFiles, setActiveFiles] = useState([]);
  const [renderTextFile, setRenderTextFile] = useState('');
  const [objectURL, setObjectURL] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(
    activeFiles.length ? activeFiles.length - 1 : 0,
  );
  const [anchorIdx, setAnchorIdx] = useState(0);
  const [state, setState] = useState(initaiState);
  let imgConRef = useRef();
  let imgRef = useRef();

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
          if (res.data.type === 'text/plain') {
            res.data.text().then((text) => {
              setRenderTextFile(text);
              setObjectURL(null);
            });
          } else {
            const objectURL = URL.createObjectURL(res.data);
            setObjectURL(objectURL);
            setRenderTextFile(null);
          }
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

  const useStyles = makeStyles(() => ({
    viewer: {
      position: 'relative',
      width: '100%',
    },
    sideBar: {
      paddingTop: '18px',
      backgroundColor: 'rgb(30, 40, 72)',
      overflow: 'scroll',
      height: 'calc(100vh - 60px)',
      fontSize: '1rem',
    },
    imageViewer: {
      width: '100%',
      height: 'calc(100vh - 60px)',
      overflow: 'hidden',
      touchAction: 'none',
      // 모바일 터치 이벤트 제한
      userSelect: 'none',
      WebkitUserSelect: 'none',
      MozUserSelect: 'none',
      msUserSelect: 'none',
      WebkitTouchCallout: 'none',
    },
  }));

  const classes = useStyles();

  const onChangeZoom = useCallback(
    ({ scale, translation }) => {
      const imgWidth = imgRef.current.clientWidth;
      const imgHeight = imgRef.current.clientHeight;
      const imgConWidth = imgConRef.current.clientWidth;
      const imgConHeight = imgConRef.current.clientHeight;

      const imageRatio = imgHeight / imgWidth;

      let width = Math.min(imgWidth, imgConWidth);
      let height = width * imageRatio;

      if (height > imgConHeight) {
        width = imgConHeight / imageRatio;
        height = imgConHeight;
      }

      const newScale = width / imgWidth;
      const UpdatedScale = Math.max(scale, newScale);

      const newState = {
        ...state,
        scale: scale,
        translation: translation,
        translationBounds: {
          xMin: -1 * (imgWidth * UpdatedScale - imgConWidth),
          xMax: 0,
          yMin: -1 * (imgHeight * UpdatedScale - imgConHeight),
          yMax: 0,
        },
      };

      setState(newState);
    },
    [state, setState],
  );

  return (
    <Grid container xs={12} className={classes.viewer}>
      {/* Side Bar */}
      <Grid item xs={3} className={classes.sideBar}>
        <SideBar
          onActiveImageChanged={onActiveImageChanged}
          baseURL={baseURL}
          mode={mode}
        />
      </Grid>

      {/* Viewer */}
      <Grid item xs={9} className={classes.imageViewer}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'calc(100vh - 60px)',
            fontSize: '3rem',
            fontStyle: 'italic',
          }}
          ref={imgConRef}
        >
          {renderTextFile && (
            <Grid container justify="center" alignItems="center">
              <pre>{renderTextFile}</pre>
            </Grid>
          )}
          {objectURL && (
            <>
              <MapInteractionCSS
                value={state}
                onChange={onChangeZoom}
                minScale={1}
                maxScale={3}
                translationBounds={{
                  xMin: state.translationBounds.xMin,
                  xMax: state.translationBounds.xMax,
                  yMin: state.translationBounds.yMin,
                  yMax: state.translationBounds.yMax,
                }}
              >
                <img
                  alt="이미지"
                  src={objectURL}
                  ref={imgRef}
                  style={{
                    width: '100%',
                    maxWidth: '100%',
                    height: 'auto',
                    cursor: 'grab',
                  }}
                />
              </MapInteractionCSS>
            </>
          )}
        </div>
      </Grid>

      {/* Tools Space */}
      {/* <Grid item xs={2}>
        업데이트중
      </Grid> */}
    </Grid>
  );
}
//     {/* tools space */}
//     {mode === 'Tools' && (
//       <div className="images__tools">
//         <Tools
//           activeFiles={activeFiles}
//           setActiveFiles={setActiveFiles}
//           currentIdx={currentIdx}
//           setCurrentIdx={setCurrentIdx}
//         />
//       </div>
//     )}
//   </div>
// </div>
