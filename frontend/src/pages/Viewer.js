import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';

import zoomStore from '../stores/zoomStore';

import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import SideBar from '../components/SideBar';

import { MapInteractionCSS } from 'react-map-interaction';

import API from '../api/index';

const Viewer = observer(({ mobileOpen, setMobileOpen }) => {
  const [activeFiles, setActiveFiles] = useState([]);
  const [renderTextFile, setRenderTextFile] = useState('');
  const [objectURL, setObjectURL] = useState(null);
  const [currentIdx, setCurrentIdx] = useState(
    activeFiles.length ? activeFiles.length - 1 : 0,
  );
  const [anchorIdx, setAnchorIdx] = useState(0);
  const classes = useStyles();

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
          // initTranslation();
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
  });

  const onActiveImageChanged = useCallback(
    /* 
      dirEntry = [
        {
          path: str,
          size: int,
          isDir: boolean,
          isActive : true
        }
    */
    (dirEntry) => {
      if (dirEntry.isActive === true) {
        setActiveFiles([...activeFiles, dirEntry]);
      } else {
        const images = activeFiles
          .concat(dirEntry)
          .filter((image) => image.isActive === true);
        setActiveFiles(images);
      }

      setActiveFiles([dirEntry]);
    },
    [activeFiles, setActiveFiles],
  );

  useEffect(() => {
    const loadImage = () => {
      URL.revokeObjectURL(objectURL);

      if (activeFiles.length > 0) {
        API.get(`/browse${activeFiles[0].path}`, {
          responseType: 'blob',
        })
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

  const onChangeZoom = useCallback(({ scale, translation }) => {
    zoomStore.setZoomState({ scale, translation });
  }, []);

  return (
    <Grid container xs={12} className={classes.container}>
      <SideBar
        onActiveImageChanged={onActiveImageChanged}
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />

      <Grid container item xs className={classes.container__dataViewer}>
        <div className={classes.dataViewer}>
          {renderTextFile && (
            <Grid item>
              <pre>{renderTextFile}</pre>
            </Grid>
          )}

          {objectURL && (
            <Grid item className={classes.container__dataViewer__img}>
              <MapInteractionCSS
                value={zoomStore.zoomState}
                onChange={onChangeZoom}
              >
                <img alt="이미지" src={objectURL} />
              </MapInteractionCSS>
            </Grid>
          )}
        </div>
      </Grid>
    </Grid>
  );
});

const useStyles = makeStyles((theme) => ({
  container: {
    position: 'relative',
    width: '100%',
  },
  container__dataViewer: {
    height: 'calc(100vh - 60px)',
    width: '100%',
    overflow: 'hidden',
    touchAction: 'none',
    fontSize: '3rem',
    fontStyle: 'italic',
    justify: 'center',
    alignItems: 'center',

    // 모바일 터치 이벤트 제한
    userSelect: 'none',
    WebkitUserSelect: 'none',
    MozUserSelect: 'none',
    msUserSelect: 'none',
    WebkitTouchCallout: 'none',
  },
  dataViewer: {
    position: 'relative',
    width: '100%',
    height: 'calc(100vh - 60px)',
    fontSize: '3rem',
    fontStyle: 'italic',
  },
}));

export default Viewer;

{
  /* <Button onClick={initTranslation} style={{ marginLeft: '20rem' }}>
          초기화
        </Button> */
}
