import axios from 'axios';
import React, { useEffect, useState } from 'react';

const SideBar = () => {
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

  useEffect(async () => {
    const dirEntries = await fetchDirEntries();
    console.log(dirEntries);
    setState({
      ...state,
      dirEntries,
    });
  }, []);

  console.log(state);

  const onClick = async (dirEntry) => {
    if (!dirEntry.isFetched) {
      dirEntry.dirEntries = await fetchDirEntries(dirEntry.path);
      dirEntry.isFetched = true;
    }
    dirEntry.open = !dirEntry.open;

    setState({ ...state });
  };

  return <ul>{renderDirEntries(state.dirEntries, onClick)}</ul>;
};

const renderDirEntries = (dirEntires, onClick) => {
  return dirEntires.map((item) => {
    return item.isDir ? (
      <Directory dirEntry={item} onClick={onClick} />
    ) : (
      <File dirEntry={item} />
    );
  });
};

const Directory = ({ dirEntry, onClick }) => {
  return (
    <>
      <li onClick={(e) => onClick(dirEntry)}>
        {dirEntry.open ? 'O' : 'D'} {extractNameFromPath(dirEntry.path)}
      </li>
      {dirEntry.open && (
        <ul style={{ marginLeft: 10 }}>
          {renderDirEntries(dirEntry.dirEntries, onClick)}
        </ul>
      )}
    </>
  );
};

const File = ({ dirEntry }) => {
  return <li>{extractNameFromPath(dirEntry.path)}</li>;
};

const extractNameFromPath = (path) => {
  const splitted = path.split('/');
  return splitted[splitted.length - 1];
};

const fetchDirEntries = async (path = '') => {
  const baseURL = '/api/browse';

  try {
    const res = await axios.get(`${baseURL}${path}`);
    return res.data;
  } catch (e) {
    alert('Error!');
  }
};

export default SideBar;
