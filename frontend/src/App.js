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
  // currentId == int
  const [currentId, setCurrentId] = useState(null);
  const [changeVersion, setChangeVersion] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get('http://localhost:8080/pics/');
      // setImages(result.data);
      console.log('result', result);
    };

    fetchData();
  }, [setImages]);

  const getImage = (id) => images.find((img) => img.id === id);
  const currentImage = getImage(currentId);

  // let promptImg;
  // if (!changeVersion) {
  //   promptImg = currentImage.download_url;
  // } else {
  //   promptImg = 'https://picsum.photos/seed/picsum/200/300';
  // }

  return (
    <div className="App">
      <div className="wrap">
        <div className="containerList">
          {images.map((item, idx) => (
            <div key={idx}>
              <p
                onClick={() => {
                  setCurrentId(item.id);
                }}
              >{`image-${item.id}`}</p>
            </div>
          ))}
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
          <button onClick={() => setChangeVersion(!changeVersion)}>원본</button>
        </div>
      </div>
    </div>
  );
}

export default App;
