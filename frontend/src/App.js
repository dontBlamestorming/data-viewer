import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Styles
import { MapInteractionCSS } from 'react-map-interaction';
import './App.css';

// Components
import Loading from './component/Loading';

// Mertiral-ui
import { List, ListItem } from '@material-ui/core';
import Button from '@material-ui/core/Button';

function App() {
  /*
    images = [
      {
        id : int,
        source : str,
        valid : str,
      },
      ...
    ]
  */
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
      // 아래는 MapInteraction props
      scale: 1,
      translation: {
        x: 0,
        y: 0,
      },
    },
  };

  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currendId, setCurrentId] = useState(1);
  const [changeVer, setChangeVer] = useState(false);
  const [state, setState] = useState(initialState);

  useEffect(() => {
    // error처리 필요할 듯
    // 성공적으로 result load시 setIsLoaded 할 것
    const getData = async () => {
      const result = await axios.get('http://localhost:8080/pics/');
      setImages(result.data);
      setIsLoaded(true);
    };

    getData();
  }, []);

  const genPicsList = () => {
    const list = images.map((image, idx) => {
      // 추후 django에서 image에 대한 name field 생성 후 front에서 pictues list 이름으로 사용하면 될 듯?

      return (
        <ListItem key={idx} onClick={() => setCurrentId(image.id)}>
          {/* 텍스트 사이즈 업 시킬 것 */}
          {`image-${idx}`}
        </ListItem>
      );
    });

    return list;
  };

  const changeImg = () => {
    if (!changeVer) {
      return (
        <img
          className="imageContent"
          alt="originalImage"
          src={images[currendId - 1].source}
        />
      );
    } else {
      return (
        <img
          className="imageContent"
          alt="retouchedImage"
          src={images[currendId - 1].valid}
        />
      );
    }
  };
  const zoomConRef = useRef(null);

  const getWindow = (imageWidth, imageHeight) => {
    const imageRatio = imageHeight / imageWidth;
    const conWid = zoomConRef.current.clientWidth;
    const conHei = zoomConRef.current.clientHeight;

    let width = Math.min(imageWidth, conWid);
    let height = width * imageRatio;
    if (height > conHei) {
      width = conHei / imageRatio;
      height = conHei;
    }
    const scale = width / imageWidth;

    return {
      container: {
        width: conWid,
        height: conHei,
      },
      image: {
        width: imageWidth,
        height: imageHeight,
        scale,
      },
      scale,
      translation: {
        x: (conWid - width) / 2,
        y: (conHei - height) / 2,
      },
    };
  };

  return (
    <div className="App">
      <div className="wrap">
        {/* Left - list */}
        <div className="containerList">
          <List>{genPicsList()}</List>
        </div>

        {/* Right - Picture */}
        <div className="containRight">
          <div className="containerImg">
            {isLoaded ? (
              <div className="imageWrap">
                <MapInteractionCSS
                // value={state}
                // onChange={() => {
                //   setState();
                // }}
                >
                  {changeImg()}
                </MapInteractionCSS>
              </div>
            ) : (
              <Loading />
            )}
          </div>

          <Button
            variant="outlined"
            color="primary"
            onClick={() => setChangeVer(!changeVer)}
          >
            원본
          </Button>
        </div>
      </div>
    </div>
  );
}

export default App;
