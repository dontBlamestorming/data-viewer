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
  const [objectURL, setObjectURL] = useState('');
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

  const useStyles = makeStyles(() => ({
    viewer: {
      position: 'relative',
      width: '100%',
    },
    sideBar: {
      backgroundColor: 'rgb(30, 40, 72)',
      overflow: 'scroll',
    },
    imageViewer: {
      width: '100%',
      height: '100%',
      overflow: 'hidden',
      cursor: 'grab',
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

      const newState = {
        ...state,
        scale: scale,
        translation: translation,
        translationBounds: {
          xMin: -1 * (imgWidth * scale - imgWidth),
          xMax: imgWidth / 2,
          yMin: -1 * (imgHeight * scale - imgHeight),
          yMax: imgHeight / 2,
        },
        imgCon: { width: imgConWidth, height: imgConHeight },
        img: { wdith: imgWidth, height: imgHeight },
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

      {/* Image Viewer */}
      <Grid item xs={7} className={classes.imageViewer}>
        <div
          style={{
            position: 'relative',
            width: '100%',
            height: '100%',
          }}
          ref={imgConRef}
        >
          {activeFiles.length > 0 && (
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
              <div
                style={{
                  position: 'relative',
                  width: '100%',
                  height: '100%',
                  transform: `translate(${state.translation.x}px, ${state.translation.y}px) scale(${state.scale})`,
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
                  }}
                />
              </div>
            </MapInteractionCSS>
          )}
        </div>
      </Grid>

      {/* Tools Space */}
      <Grid item xs={2}>
        업데이트중
      </Grid>
    </Grid>
  );
}

// <div id="viewer">
//   <div className="wrap">
//     {/* Sidebar */}

//     <div className="images__tree">
//       <Button onClick={() => setMode(mode !== 'Tools' && 'Tools')}>
//         History
//       </Button>
//       <SideBar
//         onActiveImageChanged={onActiveImageChanged}
//         baseURL={baseURL}
//         mode={mode}
//       />
//     </div>

//     {/* Image space */}
//     <div className="images__viewer">
//       {activeFiles.length > 0 && (
//         <div className="images__wrap">
//           {activeFiles.length > 0 && (
//             <MapInteraction>
//               {({ translation, scale }) => {
//                 console.log(translation, scale);

//                 return (
//                   <Container>
//                     <ImageWrapper
//                       translation={{
//                         x: translation.x,
//                         y: translation.y,
//                       }}
//                       scale={scale}
//                     >
//                       <img
//                         alt="이미지"
//                         src={objectURL}
//                         style={{ position: 'relative' }}
//                       />
//                     </ImageWrapper>
//                   </Container>
//                 );
//               }}
//             </MapInteraction>
//           )}
//         </div>
//       )}
//     </div>

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
