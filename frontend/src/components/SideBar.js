import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// fontawesome
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faChevronDown,
  faImage,
} from '@fortawesome/free-solid-svg-icons';

// style
import '../styles/SideBar.css';

const SideBar = ({ handleActiveFiles, baseURL }) => {
  /*
    state ==
      {
        dirEntries: [
          {
            path: String,
            size: Number,
            isDir: Boolean,
            dirEntries: [
              ...
            ],
          },
        ],
      };
  */
  const [state, setState] = useState({
    dirEntries: [],
  });

  useEffect(() => {
    const initData = async () => {
      const dirEntries = await fetchDirEntries(baseURL);
      setState({
        ...state,
        dirEntries,
      });
    };
    initData();
  }, []);

  const onClickFile = useCallback(
    (dirEntry) => {
      dirEntry.isActive = !dirEntry.isActive;
      setState({ ...state });
      const activeFiles = getActiveDirEntries(state.dirEntries);
      handleActiveFiles(activeFiles);
    },
    [state.dirEntries],
  );

  const onClickDir = useCallback(
    async (dirEntry) => {
      if (!dirEntry.isFetched) {
        dirEntry.dirEntries = await fetchDirEntries(baseURL, dirEntry.path);
        dirEntry.isFetched = true;
      }
      dirEntry.open = !dirEntry.open;

      setState({ ...state });
    },
    [state],
  );

  const getActiveDirEntries = useCallback((dirEntries) => {
    let res = [];
    dirEntries.forEach((item) => {
      if (item.isActive) {
        res.push(item);
      }

      if (item.dirEntries !== undefined && item.dirEntries.length > 0) {
        res = res.concat(getActiveDirEntries(item.dirEntries));
      }
    });

    return res;
  }, []);

  return (
    <>
      <div id="sidebar">
        <h1>Side Bar</h1>
        <div className="container">
          <div className="content">
            <ul>
              {renderDirEntries(state.dirEntries, onClickDir, onClickFile)}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

const renderDirEntries = (dirEntries, onClickDir, onClickFile) => {
  return dirEntries
    .sort((a, b) => {
      const nameA = extractNameFromPath(a.path).toUpperCase();
      const nameB = extractNameFromPath(b.path).toUpperCase();

      if (nameA < nameB) {
        return -1;
      } else if (nameA > nameB) {
        return 1;
      }
      return 0;
    })
    .sort((a, b) => {
      return b.isDir - a.isDir;
    })
    .map((item, index) => {
      return item.isDir ? (
        <Directory
          key={index}
          dirEntry={item}
          onClickDir={onClickDir}
          onClickFile={onClickFile}
        />
      ) : (
        <File key={index} dirEntry={item} onClickFile={onClickFile} />
      );
    });
};

const Directory = ({ dirEntry, onClickDir, onClickFile }) => {
  return (
    <>
      <div className="directory" onClick={() => onClickDir(dirEntry)}>
        <FontAwesomeIcon
          className="icon"
          icon={dirEntry.open ? faChevronDown : faChevronRight}
        />
        <li>{extractNameFromPath(dirEntry.path)}</li>
      </div>
      {dirEntry.open && (
        <ul className="directory__sub">
          {renderDirEntries(dirEntry.dirEntries, onClickDir, onClickFile)}
        </ul>
      )}
    </>
  );
};

const File = ({ dirEntry, onClickFile }) => {
  return (
    <div
      className={`file ${dirEntry.isActive && 'active'}`}
      onClick={() => onClickFile(dirEntry)}
    >
      <FontAwesomeIcon className="icon" icon={faImage} />
      <li>{extractNameFromPath(dirEntry.path)}</li>
    </div>
  );
};

const extractNameFromPath = (path) => {
  const splitted = path.split('/');
  return splitted[splitted.length - 1];
};

const fetchDirEntries = async (baseURL, path = '') => {
  try {
    const res = await axios.get(`${baseURL}${path}`);
    return res.data;
  } catch (e) {
    alert('Error!');
  }
};

export default SideBar;
