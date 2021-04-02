import React, { useState, useEffect, useCallback, useRef } from 'react';

import { makeStyles, useTheme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import SideBar from '../components/SideBar';
import Tools from '../components/Tools';

import { MapInteractionCSS } from 'react-map-interaction';

import API from '../api/index';
import '../styles/Viewer.css';

import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch'; // need to delete

const useStyles = makeStyles((theme) => ({
  viewer: {
    position: 'relative',
    width: '100%',
  },
  imageViewer: {
    height: 'calc(100vh - 60px)',
    overflow: 'hidden',
    touchAction: 'none',
    fontSize: '3rem',
    fontStyle: 'italic',
    // 모바일 터치 이벤트 제한
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTouchCallout: 'none',
    [theme.breakpoints.down('sm')]: {
      maxWidth: '100%',
      flexBasis: '100%',
    },
  },
  sideBar: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
}));

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

export default function Viewer({ mobileOpen, setMobileOpen }) {
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
  const classes = useStyles();
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

  const onChangeZoom = useCallback(
    ({ scale, translation }) => {
      const imgWidth = imgRef.current.clientWidth;
      const imgHeight = imgRef.current.clientHeight;
      const imgConWidth = imgConRef.current.clientWidth;
      const imgConHeight = imgConRef.current.clientHeight;

      const xDiff = imgConWidth - imgWidth * scale;
      const yDiff = imgConHeight - imgHeight * scale;

      const newState = {
        ...state,
        scale: scale,
        translation: translation,
        translationBounds: {
          xMin: Math.min(0, xDiff),
          xMax: Math.max(0, xDiff),
          yMin: Math.min(0, yDiff),
          yMax: Math.max(0, yDiff),
        },
      };

      setState(newState);
    },
    [state, setState],
  );

  return (
    <Grid container xs={12} className={classes.viewer}>
      {/* Side Bar */}
      <Grid
        item
        className={classes.sideBar}
        xs={3}
        style={{
          border: '5px solid pink',
        }}
      >
        <SideBar
          onActiveImageChanged={onActiveImageChanged}
          baseURL={baseURL}
          mode={mode}
          mobileOpen={mobileOpen}
          setMobileOpen={setMobileOpen}
          activeFiles={activeFiles}
          renderTextFile={renderTextFile}
        />
      </Grid>

      {/* Viewer */}
      <Grid
        container
        item
        xs={9}
        className={classes.imageViewer}
        justify="center"
        alignItems="center"
        style={{
          border: '5px solid green',
        }}
      >
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: 'calc(100vh - 60px)',
            fontSize: '3rem',
            fontStyle: 'italic',
            border: '5px solid red',
          }}
          ref={imgConRef}
        >
          {renderTextFile && (
            <Grid item>
              <pre>{renderTextFile}</pre>
            </Grid>
          )}
          {objectURL && (
            <Grid item style={{ cursor: 'zoom-in' }}>
              <MapInteractionCSS
                value={state}
                onChange={onChangeZoom}
                minScale={0.4}
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
                    width: 'auto',
                    height: 'calc(100vh - 60px)',
                    border: '5px solid red',
                  }}
                />
              </MapInteractionCSS>
            </Grid>
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
