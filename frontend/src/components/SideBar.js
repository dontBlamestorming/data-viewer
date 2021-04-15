import React, { useState, useEffect } from 'react';

import { observer } from 'mobx-react-lite';
import dataStore from '../stores/dataStore';

import TreeView from '@material-ui/lab/TreeView';
import TreeItem from '@material-ui/lab/TreeItem';

import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Drawer from '@material-ui/core/Drawer';
import Hidden from '@material-ui/core/Hidden';

import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ImageIcon from '@material-ui/icons/Image';
import TextFieldsIcon from '@material-ui/icons/TextFields';

const SideBar = observer(
  ({ onActiveImageChanged, mobileOpen, setMobileOpen }) => {
    const [expanded, setExpanded] = useState(['root']);
    const classes = useStyles();

    useEffect(() => dataStore.initializeData(), []);

    const onClick = async (dirEntry) => {
      if (!dirEntry.isDir) {
        dirEntry.isActive = !dirEntry.isActive;
        onActiveImageChanged(dirEntry);
        return;
      }

      dirEntry.dirEntries = await dataStore.fetchDirEntries(dirEntry);
      dirEntry.isFetched = true;
      dirEntry.open = !dirEntry.open;
      dataStore.setState({ ...dataStore.state });
    };

    const manageExpandedNode = (nodeId) => {
      const newExpandedId = expanded.includes(nodeId)
        ? expanded.filter((id) => id !== nodeId)
        : [...expanded, nodeId];

      setExpanded(newExpandedId);
    };

    return (
      <>
        <Grid item xs={3} className={classes.root}>
          <nav className={classes.drawer} aria-label="mailbox folders">
            {/* Labtop / Desktop */}
            <Hidden smDown implementation="css">
              <Drawer
                classes={{ paper: classes.drawerPaper }}
                variant="permanent"
                open
              >
                <TreeView
                  expanded={expanded}
                  onNodeSelect={(event, nodeId) => manageExpandedNode(nodeId)}
                >
                  {renderDirEntries(dataStore.state.dirEntries, onClick)}
                </TreeView>
              </Drawer>
            </Hidden>

            {/* Mobile */}
            <Hidden mdUp implementation="css">
              <Drawer
                classes={{ paper: classes.mobileDrawerPaper }}
                variant="temporary"
                open={mobileOpen}
                onClose={() => setMobileOpen(!mobileOpen)}
                ModalProps={{ keepMounted: true }}
              >
                <TreeView />
                <TreeView
                  expanded={expanded}
                  onNodeSelect={(event, nodeId) => manageExpandedNode(nodeId)}
                >
                  {renderDirEntries(dataStore.state.dirEntries, onClick)}
                </TreeView>
              </Drawer>
            </Hidden>
          </nav>
        </Grid>
      </>
    );
  },
);

const renderDirEntries = (dirEntries, onClick) => {
  const copiedDirEntries = dirEntries.slice();
  const sortedDirEntries = sortDirEntries(copiedDirEntries);

  return sortedDirEntries.map((dirEntry) => {
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

const compareByLocale = (a, b) => {
  const _a = a.path;
  const _b = b.path;

  return _a.localeCompare(_b, undefined, {
    numeric: true,
    sensitivity: 'base',
  });
};

const compareByIsDir = (a, b) => b.isDir - a.isDir;

const sortDirEntries = (dirEntries) => {
  dirEntries.sort((a, b) => {
    const compareIsDir = compareByIsDir(a, b);
    const compareLocale = compareByLocale(a, b);

    return compareIsDir || compareLocale;
  });

  return dirEntries;
};

const extractNameFromPath = (path, separator) => {
  const splitted = path.split(separator);
  return splitted[splitted.length - 1];
};

const useStyles = makeStyles((theme) => ({
  root: {
    [theme.breakpoints.down('sm')]: {
      display: 'none',
    },
  },
  drawer: {
    [theme.breakpoints.up('md')]: {
      width: '100%',
      flexShrink: 0,
    },
  },
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  drawerPaper: {
    width: '100%',
    position: 'relative',
    paddingTop: '25px',
    paddingLeft: '25px',
    height: 'calc(100vh - 60px)',
    fontSize: '1rem',
  },
  mobileDrawerPaper: {
    width: '50%',
    marginTop: '60px',
    padding: '18px 18px',
    height: 'calc(100vh - 60px)',
    fontSize: '1rem',
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
