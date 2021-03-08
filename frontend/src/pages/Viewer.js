import React, { useState, useEffect, useRef, useCallback } from 'react';

// Styles
import '../styles/viewer.css';
import '../styles/App.css';
import { MapInteractionCSS, MapInteraction } from 'react-map-interaction';
// import { Magnifier } from 'react-image-magnifiers';
import styled from 'styled-components';

// axios
import axios from 'axios';

// Mertiral-ui
import { List, ListItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';

// pages
import Header from './Header';

// Components
import Loading from '../components/Loading';
import SideMenu from '../components/SideMenu';

function Viewer() {
  const initialState = {
    zoom: {
      container: {
        width: 0,
        height: 0,
      },
      image: {
        width: 0,
        height: 0,
      },
      minScale: 1,
      scale: 1,
      translation: {
        x: 0,
        y: 0,
      },
    },
  };

  const [state, setState] = useState(initialState);
  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currendId, setCurrentId] = useState(1);
  const [changeVer, setChangeVer] = useState(false);

  const zoomConRef = useRef(null);
  const imgConRef = useRef(null);

  const getInitZoomState = useCallback(() => {
    const imageWidth = imgConRef.current.clientWidth;
    const imageHeight = imgConRef.current.clientHeight;

    const imageRatio = imageHeight / imageWidth;

    const conWidth = zoomConRef.current.clientWidth;
    const conHeight = zoomConRef.current.clientHeight;

    let width = Math.min(imageWidth, conWidth);
    let height = width * imageRatio;

    if (height > conHeight) {
      width = conHeight / imageRatio;
      height = conHeight;
    }

    const scale = width / imageWidth;

    return {
      container: {
        width: conWidth,
        height: conHeight,
      },
      image: {
        width: imageWidth,
        height: imageHeight,
        scale,
      },
      scale,
      translation: {
        x: (conWidth - width) / 2,
        y: (conHeight - height) / 2,
      },
    };
  }, [imgConRef, zoomConRef]);

  const onChangeZoom = useCallback(
    ({ scale, translation }) => {
      const newScale = Math.max(scale, state.zoom.image.scale);
      const xDiff =
        state.zoom.container.width - state.zoom.image.width * newScale;
      const yDiff =
        state.zoom.container.height - state.zoom.image.height * newScale;

      const newState = {
        ...state,
        zoom: {
          ...state.zoom,
          scale: newScale,
          translation: {
            x:
              xDiff < 0
                ? Math.max(xDiff, Math.min(0, translation.x))
                : xDiff / 2,
            y:
              yDiff < 0
                ? Math.max(yDiff, Math.min(0, translation.y))
                : yDiff / 2,
          },
        },
      };
      setState(newState);
      console.log(
        newState.zoom.scale,
        newState.zoom.translation,
        newState.zoom,
      );
    },
    [state, setState],
  );

  useEffect(() => {
    // error처리 필요할 듯
    // 성공적으로 result load시 setIsLoaded 할 것
    // auth.js로 보낼 것
    const getData = async () => {
      const result = await axios.get('http://localhost:8000/pics/');
      setImages(result.data);
      setIsLoaded(true);
      const zoom = getInitZoomState();
      setState({
        zoom,
      });
    };

    getData();
  }, []);

  const genPicsList = () => {
    const list = images.map((image, idx) => {
      return (
        <ListItem key={idx} onClick={() => setCurrentId(idx + 1)}>
          {/* 텍스트 사이즈 업 시킬 것 */}
          {`image-${idx + 1}`}
        </ListItem>
      );
    });

    return list;
  };

  // const changeImg = () => {
  //   if (!changeVer) {
  //     return (
  //       <img
  //         className="imageContent"
  //         alt="originalImage"
  //         src={images[currendId - 1].source}
  //       />
  //     );
  //   } else {
  //     return (
  //       <img
  //         className="imageContent"
  //         alt="retouchedImage"
  //         src={images[currendId - 1].valid}
  //       />
  //     );
  //   }
  // };

  return (
    <div className="App">
      {/* header */}
      <Header />
      {/* <SideMenu /> */}
      <div className="wrap">
        {/* Left - list */}
        <div className="containerList">
          <List>{genPicsList()}</List>
        </div>

        {/* Right - Picture */}
        <div className="containRight">
          <div className="containerImg">
            {isLoaded ? (
              <div className="imageWrap" ref={zoomConRef}>
                <MapInteraction value={state.zoom} onChange={onChangeZoom}>
                  {({ translation, scale }) => (
                    <Container>
                      <ImageWrapper
                        translation={{
                          x: translation.x,
                          y: translation.y,
                        }}
                        scale={scale}
                      >
                        <img
                          ref={imgConRef}
                          // style={{ position: 'absolute' }}
                          className="imageContent"
                          alt="originalImage"
                          src={images[currendId - 1].source}
                        />
                      </ImageWrapper>
                    </Container>
                  )}
                </MapInteraction>
              </div>
            ) : (
              <Loading />
            )}
          </div>
          {/* Right - Button */}
          <div className="preview">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setChangeVer(!changeVer)}
            >
              x - y{' '}
            </Button>
          </div>
        </div>
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
  position: absolute;
`;

export default Viewer;
