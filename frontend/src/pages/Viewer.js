import React, { useState, useEffect, useCallback } from 'react';

// Mertiral-ui
import Button from '@material-ui/core/Button';

// Styles
import '../styles/Viewer.css';

// Components
import SideBar from '../components/SideBar';

function Viewer() {
  const baseURL = '/api/browse';
  const [images, setImages] = useState([]);
  const [currentId, setCurrentId] = useState(0);

  const increaseCurrentId = useCallback(() => {
    if (images.length > 0) {
      setCurrentId(Math.min(currentId + 1, images.length - 1));
    }
  }, [currentId, images]);

  const decreaseCurrentId = useCallback(() => {
    if (images.length > 0) {
      setCurrentId(Math.max(0, currentId - 1));
    }
  }, [currentId, images]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      switch (e.key) {
        case 'ArrowRight':
          increaseCurrentId();
          break;

        case 'ArrowLeft':
          decreaseCurrentId();
          break;

        case 'ArrowDown':
        case 'ArrowUp':
        case ' ':
          e.preventDefault();
          break;

        default:
          return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [increaseCurrentId, decreaseCurrentId]);

  const handleActiveFiles = (dirEntry) => {
    /* 
      dirEntry = [
        {
          path: str,
          size: int,
          isDir: boolean,
          isActive : true
        }
      ]
    */

    let imagesPaths = [];
    dirEntry.forEach((item) => {
      const splitted = item.path.split('.');
      const extention = splitted[splitted.length - 1];

      if (extention === 'png') {
        imagesPaths.push(item.path);
      } else {
        console.log('png파일이 아닙니다.');
      }
    });

    setImages(imagesPaths);
  };

  const renderLoadedImages = (currentId) => {
    if (images.length > 0) {
      return <img alt="이미지" src={`${baseURL}${images[currentId]}`} />;
    }
  };

  return (
    <div id="viewer">
      <div className="wrap">
        {/* Sidebar */}
        <div className="images__tree">
          <SideBar handleActiveFiles={handleActiveFiles} baseURL={baseURL} />
        </div>

        {/* Image space */}
        <div className="images__viewer">
          {images.length > 0 && (
            <>
              <div className="imageWrap">{renderLoadedImages(currentId)}</div>

              <Button className="Btn" onClick={() => decreaseCurrentId()}>
                decrease ID
              </Button>

              <Button className="Btn" onClick={() => increaseCurrentId()}>
                increase ID
              </Button>
            </>
          )}
        </div>

        {/* tools space */}
        <div className="images__tools">
          <h1>Tools space</h1>
        </div>
      </div>
    </div>
  );
}

export default Viewer;
