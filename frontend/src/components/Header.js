import React from 'react';
import { Link } from 'react-router-dom';

import { observer } from 'mobx-react-lite';
import userStore from '../stores/userStore';
import zoomStore from '../stores/zoomStore';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import logoImage from '../assets/logo.png';

const useStyles = makeStyles((theme) => ({
  header: {
    height: '60px',
    display: 'flex',
    position: 'relative',
    backgroundColor: 'rgb(248, 249, 250)',
    boxShadow: 'rgb(0 0 0 / 16%) 0px 3px 6px',
    zIndex: '999',
  },
  leftNav: {
    marginLeft: '20px',
  },
  rightNav: {
    marginRight: '10px',
  },
  contents: {
    marginBottom: '10px',
  },
  logoImage: {
    maxHeight: '25px',
  },
  // Mobile
  menuButton: {
    marginRight: theme.spacing(2),
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
}));

const Header = observer(({ mobileOpen, setMobileOpen }) => {
  const classes = useStyles();

  return (
    <Grid container className={classes.header} xs={12}>
      <Grid container className={classes.leftNav} item alignItems="center" xs>
        <Grid item>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            className={classes.menuButton}
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <MenuIcon />
          </IconButton>
        </Grid>

        <Grid item>
          <Link to="/">
            <img
              alt="로고이미지"
              src={logoImage}
              className={classes.logoImage}
            />
          </Link>
        </Grid>
      </Grid>

      <Grid
        container
        className={classes.rightNav}
        item
        xs
        justify="flex-end"
        alignItems="center"
        spacing={3}
      >
        <Grid item>
          <Button onClick={() => zoomStore.resetZoomState()}>
            위치 초기화
          </Button>
        </Grid>

        <Grid item>
          <Button onClick={userStore.logout}>
            {userStore.user ? '로그아웃' : 'Data Viewer'}
          </Button>
        </Grid>
      </Grid>
    </Grid>
  );
});

export default Header;
