import React, { useState, useEffect, useCallback } from 'react';

import axios from 'axios';
import Button from '@material-ui/core/Button';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faChevronDown,
  faImage,
} from '@fortawesome/free-solid-svg-icons';

import '../styles/SideBar.css';

const SideBar = ({ onActiveImageChanged, baseURL }) => {
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
    currentDirEntry: undefined,
    currentIdx: undefined,
  });
  /*
    useEffect(() => {
      const handleKeyDown = (e) => {
        switch (e.key) {
          case 'ArrowUp':
            e.preventDefault();
            onClickFile();
            break;
        }
      };
    });
  */
  useEffect(() => {
    const initData = async () => {
      const dirEntries = await fetchDirEntries();
      setState({
        ...state,
        dirEntries,
      });
    };

    initData();
  }, []);

  const onClickFile = useCallback(
    (dirEntry, index) => {
      dirEntry.isActive = !dirEntry.isActive;
      setState({ ...state, currentDirEntry: index });
      onActiveImageChanged(dirEntry);
    },
    [onActiveImageChanged, state],
  );

  const onClickDir = useCallback(
    async (dirEntry) => {
      if (!dirEntry.isFetched) {
        dirEntry.dirEntries = await fetchDirEntries(dirEntry);
        dirEntry.isFetched = true;
      }
      dirEntry.open = !dirEntry.open;

      setState({ ...state });
    },
    [state, baseURL],
  );

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

const compareByName = (a, b) => {
  const nameA = extractNameFromPath(a.path).toUpperCase();
  const nameB = extractNameFromPath(b.path).toUpperCase();

  if (nameA < nameB) {
    return -1;
  } else if (nameA > nameB) {
    return 1;
  }
  return 0;
};

const compareByIsDir = (a, b) => b.isDir - a.isDir;

const renderDirEntries = (dirEntries, onClickDir, onClickFile) => {
  return dirEntries
    .sort((a, b) => {
      const compareName = compareByName(a, b);
      const compareIsDir = compareByIsDir(a, b);

      return compareIsDir || compareName;
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
        <File
          key={index}
          index={index}
          dirEntry={item}
          onClickFile={onClickFile}
        />
      );
    });
};

// for initialize -> 나중에 초기화하는 과정에서 사용할 함수
// const getActiveDirEntries = (dirEntries) => {
//   let res = [];
//   dirEntries.forEach((item) => {
//     if (item.isActive) res.push(item);

//     if (item.dirEntries !== undefined && item.dirEntries.length > 0) {
//       res = res.concat(getActiveDirEntries(item.dirEntries));
//     }
//   });

//   return res;
// };

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

const File = ({ dirEntry, onClickFile, index }) => {
  return (
    <div
      className={`file`}
      onClick={() => {
        onClickFile(dirEntry, index);
      }}
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

const fetchDirEntries = async (dirEntry) => {
  const baseURL = '/api/browse';

  try {
    const res = await axios.get(`${baseURL}${dirEntry ? dirEntry.path : ''}`);

    return res.data.map((val) => ({
      path: val.path,
      size: val.size,
      isDir: val.isDir,
      parent: dirEntry,
    }));
  } catch (e) {
    alert('Error!');
    throw e;
  }
};

export default SideBar;
