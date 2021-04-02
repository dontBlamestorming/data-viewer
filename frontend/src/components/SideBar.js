import React, { useState, useEffect, useCallback } from 'react';

import API from '../api/index';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import PropTypes from 'prop-types';
import AppBar from '@material-ui/core/AppBar';
import CssBaseline from '@material-ui/core/CssBaseline';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

// icon
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ImageIcon from '@material-ui/icons/Image';
import TextFieldsIcon from '@material-ui/icons/TextFields';
import MenuIcon from '@material-ui/icons/Menu';

// import '../styles/SideBar.css';

const drawerWidth = 300;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
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
  drawerPaper: {
    position: 'relative',
    width: drawerWidth,
    paddingTop: '18px',
    backgroundColor: 'rgb(30, 40, 72)',
    height: 'calc(100vh - 60px)',
    fontSize: '1rem',
    color: 'white',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  listItem: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  icon: {
    color: 'white',
    minWidth: '28px',
  },
}));

const SideBar = React.memo(
  ({
    mobileOpen,
    setMobileOpen,
    onActiveImageChanged,
    baseURL,
    mode,
    activeFiles,
    renderTextFile,
  }) => {
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
    const [activedDirEnrty, setActivedDirEnrty] = useState({});
    const classes = useStyles();
    const theme = useTheme();

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
      async (dirEntry) => {
        dirEntry.isActive = !dirEntry.isActive;

        switch (mode) {
          case 'Default':
            if (dirEntry.isActive) {
              activedDirEnrty.isActive = false;
              setActivedDirEnrty(dirEntry);
            }
            onActiveImageChanged(dirEntry);
            break;

          default:
            break;
        }

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
        console.log('onClickDir re assigned');
        setState({ ...state });
      },
      [state, fetchDirEntries],
    );

    // window(body)를 ref하는 뜻
    // const container = window.document.body;

    console.log('SideBar rendered');

    return (
      <>
        <div className={classes.root}>
          <CssBaseline />

          <nav className={classes.drawer} aria-label="mailbox folders">
            {/* Mobile */}
            <Hidden smUp implementation="css">
              <Drawer
                // container={container}
                anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                open={mobileOpen || renderTextFile}
                onClick={() => setMobileOpen(!mobileOpen)}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                <div>
                  <div className={classes.toolbar}>
                    <List>
                      {renderDirEntries(
                        state.dirEntries,
                        onClickDir,
                        onClickFile,
                      )}
                    </List>
                  </div>
                </div>
              </Drawer>
            </Hidden>

            {/* labtop / desktop */}
            <Hidden mdDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                <div>
                  <div className={classes.toolbar}>
                    <List>
                      {renderDirEntries(
                        state.dirEntries,
                        onClickDir,
                        onClickFile,
                      )}
                    </List>
                  </div>
                </div>
              </Drawer>
            </Hidden>
          </nav>
        </div>
      </>
    );
  },
);

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
    .map((item) => {
      return item.isDir ? (
        <Directory
          key={item.path}
          dirEntry={item}
          onClickDir={onClickDir}
          onClickFile={onClickFile}
        />
      ) : (
        <File key={item.path} dirEntry={item} onClickFile={onClickFile} />
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

const Directory = React.memo(({ dirEntry, onClickDir, onClickFile }) => {
  const classes = useStyles();
  console.log('Dir rerendered');

  return (
    <>
      <ListItem
        className={classes.listItem}
        button
        onClick={() => onClickDir(dirEntry)}
      >
        <ListItemIcon className={classes.icon}>
          {dirEntry.open ? <ArrowDropDownIcon /> : <ArrowRightIcon />}
        </ListItemIcon>
        <ListItemText>{extractNameFromPath(dirEntry.path, '/')}</ListItemText>
      </ListItem>

      {dirEntry.open && (
        <ul>
          <List>
            {renderDirEntries(dirEntry.dirEntries, onClickDir, onClickFile)}
          </List>
        </ul>
      )}
    </>
  );
});

const File = React.memo(({ dirEntry, onClickFile }) => {
  const extention = extractNameFromPath(dirEntry.path, '.');
  const classes = useStyles();

  console.log('File rerendered');
  return (
    <ListItem
      button
      className={`${classes.listItem} ${dirEntry.isActive && 'active'}`}
      onClick={() => {
        onClickFile(dirEntry);
      }}
    >
      <ListItemIcon className={classes.icon}>
        {extention === 'txt' ? <TextFieldsIcon /> : <ImageIcon />}
      </ListItemIcon>
      <ListItemText>{extractNameFromPath(dirEntry.path, '/')}</ListItemText>
    </ListItem>
  );
});

const extractNameFromPath = (path, separator) => {
  const splitted = path.split(separator);
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
