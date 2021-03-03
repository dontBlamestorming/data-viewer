import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

// Styles
import { MapInteractionCSS, MapInteraction } from 'react-map-interaction';
import './App.css';

// Components
import Loading from './component/Loading/Loading';

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

  const [images, setImages] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [currendId, setCurrentId] = useState(1);
  const [changeVer, setChangeVer] = useState(false);

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
                // value={state} onChange={onChangeZoom}
                >
                  {changeImg()}
                </MapInteractionCSS>
              </div>
            ) : (
              <Loading />
            )}
          </div>
          <div className="preview">
            <Button
              variant="outlined"
              color="primary"
              onClick={() => setChangeVer(!changeVer)}
            >
              button
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
