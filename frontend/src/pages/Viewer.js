import React, { useState, useEffect, useCallback, useRef } from 'react';

import { makeStyles, useTheme } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import SideBar from '../components/SideBar';
import Tools from '../components/Tools';

import { MapInteractionCSS } from 'react-map-interaction';

import API from '../api/index';
import '../styles/Viewer.css';

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
  const [state, setState] = useState({
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
  });
  console.log(state.translation.x);
  console.log(state.translation.y);

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

  const initTranslation = useCallback(() =>
    setState({ ...state, translation: { x: 0, y: 0 } }),
  );

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
          initTranslation();
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
    const loadImage = () => {
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
    };
    loadImage();
  }, [activeFiles, currentIdx]);

  useEffect(() => {
    const calcZoomBounds = () => {
      if (imgRef.current) {
        const imgWidth = imgRef.current.clientWidth;
        const imgHeight = imgRef.current.clientHeight;
        const conWidth = imgConRef.current.clientWidth;
        const conHeight = imgConRef.current.clientHeight;

        const xDiff = conWidth - imgWidth * state.scale;
        const yDiff = conHeight - imgHeight * state.scale;

        setState({
          ...state,
          translationBounds: {
            xMin: Math.min(0, xDiff),
            yMin: Math.min(0, yDiff),
            xMax: Math.max(0, xDiff),
            yMax: Math.max(0, yDiff),
          },
        });
      }
    };

    calcZoomBounds();
  }, [imgRef.current, imgConRef.current, state.scale]);

  const onActiveImageChanged = useCallback(
    (dirEntry) => {
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
    },
    [activeFiles, setActiveFiles],
  );

  const onChangeZoom = useCallback(
    ({ scale, translation }) => {
      const newState = {
        ...state,
        scale,
        translation,
      };
      setState(newState);
    },
    [state, setState],
  );

  return (
    <Grid container xs={12} className={classes.viewer}>
      {/* Side Bar */}

      <Grid item className={classes.sideBar} xs={3}>
        <Button onClick={initTranslation} style={{ marginLeft: '20rem' }}>
          초기화
        </Button>
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
      >
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
            <Grid item>
              <pre>{renderTextFile}</pre>
            </Grid>
          )}
          {objectURL && (
            <Grid
              item
              style={{ cursor: 'zoom-in', heigth: 'calc(100vh - 60px)' }}
            >
              <MapInteractionCSS
                value={state}
                onChange={onChangeZoom}
                // translationBounds={{
                //   xMin: state.translationBounds.xMin,
                //   xMax: state.translationBounds.xMax,
                //   yMin: state.translationBounds.yMin,
                //   yMax: state.translationBounds.yMax,
                // }}
              >
                <img alt="이미지" src={objectURL} ref={imgRef} />
              </MapInteractionCSS>
            </Grid>
          )}
        </div>
      </Grid>
    </Grid>
  );
}
