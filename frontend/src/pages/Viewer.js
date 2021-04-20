import React, { useState, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';

import dataStore from '../stores/dataStore';
import zoomStore from '../stores/zoomStore';

import { makeStyles } from '@material-ui/core';
import Grid from '@material-ui/core/Grid';

import SideBar from '../components/SideBar';

import { MapInteractionCSS } from 'react-map-interaction';

import API from '../api/index';

const Viewer = observer(() => {
  const [activeImage, setActiveImage] = useState(null);
  const [activeText, setActiveText] = useState('');
  const classes = useStyles();

  useEffect(() => {
    const loadImage = () => {
      URL.revokeObjectURL(activeImage);

      if (dataStore.activeFile) {
        API.get(`/browse${dataStore.activeFile.path}`, {
          responseType: 'blob',
        })
          .then((res) => {
            if (res.data.type === 'text/plain') {
              res.data.text().then((text) => {
                setActiveText(text);
                setActiveImage(null);
              });
            } else {
              const activeImage = URL.createObjectURL(res.data);
              setActiveImage(activeImage);
              setActiveText(null);
            }
          })
          .catch((e) => {
            throw e;
          });
      }
    };
    loadImage();
  }, [dataStore.activeFile]);

  const onChangeZoom = useCallback(({ scale, translation }) => {
    zoomStore.setZoomState({ scale, translation });
  }, []);

  return (
    <Grid container xs={12} className={classes.container}>
      <SideBar />

      <Grid container item xs className={classes.container__dataViewer}>
        <div className={classes.dataViewer}>
          {activeImage && (
            <Grid item className={classes.container__dataViewer__img}>
              <MapInteractionCSS
                value={zoomStore.zoomState}
                onChange={onChangeZoom}
              >
                <img alt="이미지" src={activeImage} />
              </MapInteractionCSS>
            </Grid>
          )}

          {activeText && (
            <Grid item>
              <pre>{activeText}</pre>
            </Grid>
          )}
        </div>
      </Grid>
    </Grid>
  );
});

const useStyles = makeStyles(() => ({
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

/* 
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

*/
