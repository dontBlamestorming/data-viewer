import React, { useState } from 'react';

const initialState = [
  {
    path: '/a',
    name: 'a',
    isDir: true,
    open: false,
    subPath: [
      {
        path: '/a/first',
        name: 'first',
        isDir: false,
      },
      {
        path: '/a/second',
        name: 'second',
        isDir: true,
        open: false,
        subPath: [
          {
            path: 'a/second/alpha',
            name: 'alpha',
            isDir: false,
          },
        ],
      },
    ],
  },
  {
    path: '/b',
    name: 'b',
    isDir: false,
  },
];

const SideBar = () => {
  const [state, setState] = useState(initialState);

  const onClick = (path) => {
    path.open = !path.open;
    setState([...state]);
  };

  console.log('on render', state);
  return (
    <ul>
      {state.map((item) => {
        return item.isDir ? (
          <Directory path={item} onClick={onClick} />
        ) : (
          <File path={item} />
        );
      })}
    </ul>
  );
};

const Directory = ({ path, onClick }) => {
  if (path.open) {
    return (
      <>
        <li onClick={(e) => onClick(path)}>O {path.name}</li>
        <ul style={{ marginLeft: 10 }}>
          {path.subPath.map((item) => {
            return item.isDir ? (
              <Directory path={item} onClick={onClick} />
            ) : (
              <File path={item} />
            );
          })}
        </ul>
      </>
    );
  } else {
    return <li onClick={(e) => onClick(path)}>D {path.name}</li>;
  }
};

const File = ({ path }) => {
  return <li>F {path.name}</li>;
};

export default SideBar;
