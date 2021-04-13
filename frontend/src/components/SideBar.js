import React, { useState, useEffect, useCallback } from 'react';

import { toJS } from 'mobx';
import { observer } from 'mobx-react-lite';
import dataStore from '../stores/dataStore';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ImageIcon from '@material-ui/icons/Image';
import TextFieldsIcon from '@material-ui/icons/TextFields';

const SideBar = observer(({ onActiveImageChanged }) => {
  const [expanded, setExpanded] = useState(['root']);
  const classes = useStyles();

  useEffect(() => dataStore.initializeData(), []);

  const onClick = (dirEntry) => {
    if (dirEntry.isDir) return dataStore.onClickDirectory(dirEntry);

    dirEntry.isActive = !dirEntry.isActive;
    onActiveImageChanged(dirEntry);
  };

  const manageExpandedData = (nodeId) => {
    const newExpandedId = expanded.includes(nodeId)
      ? expanded.filter((id) => id !== nodeId)
      : [...expanded, nodeId];

    setExpanded(newExpandedId);
  };

  return (
    <>
      <div className={classes.root}>
        <nav className={classes.drawer} aria-label="mailbox folders">
          {/* Labtop / Desktop */}
          <Hidden mdDown implementation="css">
            <Drawer
              classes={{ paper: classes.drawerPaper }}
              variant="permanent"
              open
            >
              <div className={classes.toolbar}>
                <TreeView
                  expanded={expanded}
                  // expanded={dataStore.expanded}
                  onNodeSelect={(event, nodeId) => manageExpandedData(nodeId)}
                >
                  {renderDirEntries(dataStore.state.dirEntries, onClick)}
                </TreeView>
              </div>
            </Drawer>
          </Hidden>
        </nav>
      </div>
    </>
  );
});

const renderDirEntries = (dirEntries, onClick) => {
  // const sortedDirEntries = sortDirEntries(dirEntries);

  return dirEntries.map((dirEntry) => {
    const childDirEntry = dirEntry.dirEntries ? dirEntry.dirEntries : null;
    const listName = extractNameFromPath(dirEntry.path, '/');
    const extentions = extractNameFromPath(dirEntry.path, '.');

    return (
      <TreeItem
        key={dirEntry.path}
        nodeId={dirEntry.path}
        label={listName}
        onLabelClick={() => onClick(dirEntry)}
        icon={
          dirEntry.isDir ? (
            dirEntry.open ? (
              <ArrowDropDownIcon />
            ) : (
              <ArrowRightIcon />
            )
          ) : extentions === 'png' ? (
            <ImageIcon />
          ) : (
            <TextFieldsIcon />
          )
        }
      >
        {Array.isArray(childDirEntry)
          ? renderDirEntries(childDirEntry, onClick)
          : null}
      </TreeItem>
    );
  });
};

// const compareByLocale = (a, b) => {
//   const _a = a.path;
//   const _b = b.path;

//   return _a.localeCompare(_b, undefined, {
//     numeric: true,
//     sensitivity: 'base',
//   });
// };

// const compareByIsDir = (a, b) => b.isDir - a.isDir;

// const sortDirEntries = (dirEntries) => {
//   dirEntries.sort((a, b) => {
//     const compareIsDir = compareByIsDir(a, b);
//     const compareLocale = compareByLocale(a, b);

//     return compareIsDir || compareLocale;
//   });

//   return dirEntries;
// };

const extractNameFromPath = (path, separator) => {
  const splitted = path.split(separator);
  return splitted[splitted.length - 1];
};

// const fetchDirEntries = async (dirEntry) => {
//   try {
//     const res = await API.get(`/browse${dirEntry ? dirEntry.path : ''}`);
//     return res.data.map((val) => ({
//       path: val.path,
//       size: val.size,
//       isDir: val.isDir,
//       parent: dirEntry,
//     }));
//   } catch (e) {
//     throw e;
//   }
// };

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: '100%',
      flexShrink: 0,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('sm')]: {
      display: 'none',
    },
  },
  // necessary for content to be below app bar
  toolbar: theme.mixins.toolbar,
  toolbar: {
    paddingLeft: '40px',
  },
  drawerPaper: {
    position: 'relative',
    width: '100%',
    paddingTop: '18px',
    backgroundColor: 'rgb(255, 255, 255)',
    height: 'calc(100vh - 60px)',
    fontSize: '1rem',
    color: 'black',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
    margin: '-8px',
  },
  icon: {
    color: 'white',
    minWidth: '28px',
  },
}));

export default SideBar;

/*
  for initialize -> 나중에 초기화하는 과정에서 사용할 함수
  const getActiveDirEntries = (dirEntries) => {
    let res = [];
    dirEntries.forEach((item) => {
      if (item.isActive) res.push(item);

      if (item.dirEntries !== undefined && item.dirEntries.length > 0) {
        res = res.concat(getActiveDirEntries(item.dirEntries));
      }
    });

    return res;
  };
*/

/* Mobile
<Hidden smUp implementation="css">
  <Drawer
    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
    // open={mobileOpen || renderTextFile} Warning!
    onClick={() => setMobileOpen(!mobileOpen)}
    classes={{
      paper: classes.drawerPaper,
    }}
    ModalProps={{
      keepMounted: true, // Better open performance on mobile.
    }}
  >
    <div>
      <div className={classes.toolbar}>{renderSideBar(state.dirEntries)}</div>
    </div>
  </Drawer>
</Hidden> */

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

// const [state, setState] = useState({ dirEntries: [] });
// const [expanded, setExpanded] = useState(['root']);
// const [activedDirEnrty, setActivedDirEnrty] = useState({});

// useEffect(() => {
//   const initData = async () => {
//     const dirEntries = await fetchDirEntries();
//     setState({
//       ...state,
//       dirEntries,
//     });
//   };

//   initData();
// }, []);

// When click directory
// dirEntry.dirEntries = await dataStore.fetchDirEntries(dirEntry);
// dirEntry.isFetched = true;
// dirEntry.open = !dirEntry.open;

// setState({ ...state });
// dataStore.setState({ ...dataStore.state });

// switch (mode) {
//   case 'Default':
//     if (dirEntry.isActive) {
//       dataStore.activedDirEnrty.isActive = false;
//       dataStore.setActivedDirEnrty(dirEntry);
//       // setActivedDirEnrty(dirEntry);
//     }

//     onActiveImageChanged(dirEntry);
//     break;

//   default:
//     break;
// }
