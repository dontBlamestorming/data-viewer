import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapInteractionCSS } from 'react-map-interaction';
import Loading from './component/Loading';

import './App.css';

function App() {
  /*
  images == [
    {
      id: int,
      author: str,
      width: int,
      height: int,
      url: url str,
      download_url: url str,
    },
    ...
  ]
  */
  const [images, setImages] = useState([]);
  const [currentId, setCurrentId] = useState(null);
  const [changeVersion, setChangeVersion] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('https://picsum.photos/v2/list');
      setImages(result.data);
      // console.log('result', result);
    };

    fetchData();
  }, [setImages]);

  const getImage = (id) => images.find((img) => img.id === id);
  const currentImage = getImage(currentId);

  return (
    <div className="App">
      <div className="wrap">
        <div className="containerList">
          {images.map((item, idx) => {
            console.log('idx', item.id);
            return (
              <div key={idx}>
                <p
                  onClick={() => {
                    setCurrentId(item.id);
                  }}
                >{`image-${item.id}`}</p>
              </div>
            );
          })}
        </div>
        <div className="containRight">
          <div className="containerImg">
            {/* <img src={`${promptImg}`} />
             */}
            {currentImage ? (
              <div className="imageWrap">
                <MapInteractionCSS>
                  <img
                    className="imageContent"
                    alt={`image-${currentImage.author}`}
                    src={`${currentImage.download_url}`}
                  />
                </MapInteractionCSS>
              </div>
            ) : (
              <Loading />
            )}
          </div>
          {/* <button onClick={() => doDisplay()}>원본</button> */}
        </div>
      </div>
    </div>
  );
}

export default App;
