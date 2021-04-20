import React, { useState, useEffect } from 'react';

import { runInAction, toJS } from 'mobx';
import { observer } from 'mobx-react-lite';

import dataStore from '../stores/dataStore';
import appStore from '../stores/appStore';
import zoomStore from '../stores/zoomStore';

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

const SideBar = observer(() => {
  const [expanded, setExpanded] = useState(['root']);
  const classes = useStyles();

  useEffect(() => dataStore.initData(), []);

  const onClick = async (dirEntry) => {
    if (dirEntry.isDir) {
      await dataStore.fetchDirEntries(dirEntry);
    } else {
      dataStore.onActiveImageChanged(dirEntry);
    }

    runInAction(() => (dirEntry.open = !dirEntry.open));
  };

  const manageExpandedNode = (nodeId) => {
    const extention = extractNameFromPath(nodeId, '.');
    if (extention === 'png' || extention === 'txt') return;

    const newExpandedId = expanded.includes(nodeId)
      ? expanded.filter((id) => id !== nodeId)
      : [...expanded, nodeId];

    setExpanded(newExpandedId);
  };

  return (
    <>
      <Grid item xs={3} className={classes.root}>
        <nav className={classes.drawer} aria-label="mailbox folders">
          <Hidden smDown implementation="css">
            <Drawer
              classes={{ paper: classes.drawerPaper }}
              variant="permanent"
              open
            >
              {renderTreeView(manageExpandedNode, onClick, expanded)}
            </Drawer>
          </Hidden>

          <Hidden mdUp implementation="css">
            <Drawer
              classes={{ paper: classes.mobileDrawerPaper }}
              variant="temporary"
              open={appStore.mobileOpen}
              onClose={() => appStore.setMobileOpen()}
              ModalProps={{ keepMounted: true }}
            >
              {renderTreeView(manageExpandedNode, onClick, expanded)}
            </Drawer>
          </Hidden>
        </nav>
      </Grid>
    </>
  );
});

const renderTreeView = (manageExpandedNode, onClick, expanded) => (
  <TreeView
    expanded={expanded}
    onNodeSelect={(event, nodeId) => manageExpandedNode(nodeId)}
  >
    {renderDirEntries(
      dataStore.dirEntries,
      onClick,
      expanded,
      manageExpandedNode,
    )}
  </TreeView>
);

const renderDirEntries = (
  dirEntries,
  onClick,
  expanded,
  manageExpandedNode,
) => {
  return dirEntries.map((dirEntry) => {
    const listName = extractNameFromPath(dirEntry.path, '/');

    return (
      <TreeItem
        key={dirEntry.path}
        nodeId={dirEntry.path}
        label={listName}
        onLabelClick={() => onClick(dirEntry)}
        onKeyDown={(event) =>
          handleKeyDown(event, dirEntry, onClick, manageExpandedNode)
        }
        icon={getTreeIcon(dirEntry, expanded)}
      >
        {dirEntry.isDir &&
          dirEntry.dirEntries &&
          renderDirEntries(
            dirEntry.dirEntries,
            onClick,
            expanded,
            manageExpandedNode,
          )}
      </TreeItem>
    );
  });
};

const handleKeyDown = (event, dirEntry, onClick, manageExpandedNode) => {
  switch (event.key) {
    case 'ArrowRight':
      onClick(dirEntry);
      manageExpandedNode(dirEntry.path);
      event.stopPropagation();
      // event.preventDefault();

      break;
    case 'ArrowLeft':
      manageExpandedNode(dirEntry.path);
      event.stopPropagation();
      // event.preventDefault();
      break;
    case ' ':
      zoomStore.resetZoomState();
      // event.preventDefault();
      event.stopPropagation();
      break;
    default:
      return;
  }
};

const getTreeIcon = (dirEntry, expanded) => {
  if (dirEntry.isDir) {
    return expanded.includes(dirEntry.path) ? (
      <ArrowDropDownIcon />
    ) : (
      <ArrowRightIcon />
    );
  }

  const extentions = extractNameFromPath(dirEntry.path, '.');
  return extentions === 'png' ? <ImageIcon /> : <TextFieldsIcon />;
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
