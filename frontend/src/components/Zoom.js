import React, { useState, useRef, useCallback } from 'react';
import styled from 'styled-components';
import { MapInteractionCSS, MapInteraction } from 'react-map-interaction';
import { Magnifier } from 'react-image-magnifiers';

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

function Zoom() {
  const [image, setImage] = useState([]);
  const [state, setState] = useState(initialState);
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

  return (
    <div>
      <h1>Hello!!! This is Zoom!!!!</h1>
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
                  src={image}
                />
              </ImageWrapper>
            </Container>
          )}
        </MapInteraction>
      </div>
    </div>
  );
}

export default Zoom;

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
