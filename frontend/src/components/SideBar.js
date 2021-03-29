import React, { useState, useEffect, useCallback } from 'react';

import API from '../api/index';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faChevronRight,
  faChevronDown,
  faImage,
} from '@fortawesome/free-solid-svg-icons';

import '../styles/SideBar.css';

const SideBar = ({ onActiveImageChanged, baseURL, mode }) => {
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
  const [activedDirEnrty, setActivedDirEnrty] = useState({});

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
    async (dirEntry, index) => {
      dirEntry.isActive = !dirEntry.isActive;

      switch (mode) {
        case 'Default':
          if (dirEntry.isActive) {
            activedDirEnrty.isActive = false;
            setActivedDirEnrty(dirEntry);
          }
          setState({ ...state, currentDirEntry: index });
          onActiveImageChanged(dirEntry);
          break;

        default:
          break;
      }

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

/*

  숫자라면 ? 숫자로 비교해서 ~
  문자라면 ? 사전적 순서대로 ~

  1. isDir인지 아닌지 체크
  2. 이름으로 비교해서 정렬
  3. 숫자로비교 ~


*/

const compareByLocale = (a, b) => {
  const _a = a.path;
  const _b = b.path;

  return _a.localeCompare(_b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

const compareByIsDir = (a, b) => b.isDir - a.isDir;

const renderDirEntries = (dirEntries, onClickDir, onClickFile) => {
  return dirEntries
    .sort((a, b) => {
      const compareIsDir = compareByIsDir(a, b);
      const compareLocale = compareByLocale(a, b);

      return compareIsDir || compareLocale;
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
      <li className="directory" onClick={() => onClickDir(dirEntry)}>
        <FontAwesomeIcon
          className="icon"
          icon={dirEntry.open ? faChevronDown : faChevronRight}
        />
        <span>{extractNameFromPath(dirEntry.path)}</span>
      </li>

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
    <li
      id={index}
      // className={`file  ${dirEntry.isActive && 'active'}`}
      className={`file  ${dirEntry.isActive && 'active'}`}
      onClick={() => {
        onClickFile(dirEntry, index);
      }}
    >
      <FontAwesomeIcon className="icon" icon={faImage} />
      <span>{extractNameFromPath(dirEntry.path)}</span>
    </li>
  );
};

const extractNameFromPath = (path) => {
  const splitted = path.split('/');
  return splitted[splitted.length - 1];
};

const fetchDirEntries = async (dirEntry) => {
  try {
    const res = await API.get(`/browse${dirEntry ? dirEntry.path : ''}`);

    return res.data.map((val) => ({
      path: val.path,
      size: val.size,
      isDir: val.isDir,
      parent: dirEntry,
    }));
  } catch (e) {
    throw e;
  }
};

export default SideBar;

/*
  click ? 클릭한 해당 list의 className을 active, 
  다른 list 클릭하면? 기존의 active였던 list className 초기화
  기존에 클릭되었던 id 기억하고 그거 초기화 시키면 될것같은데 



*/
