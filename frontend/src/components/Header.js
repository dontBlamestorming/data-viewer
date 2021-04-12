import React from 'react';
import { Link } from 'react-router-dom';

import { observer } from 'mobx-react-lite';
import userStore from '../stores/userStore';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

import logoImage from '../assets/logo.png';

const useStyles = makeStyles((theme) => ({
  header: {
    height: '60px',
    position: 'relative',
    backgroundColor: 'rgb(248, 249, 250)',
    display: 'flex',
    boxShadow: 'rgb(0 0 0 / 16%) 0px 3px 6px',
    zIndex: '999',
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
    <Grid
      container
      className={classes.header}
      alignItems="flex-end"
      justify="center"
      item
      xs={12}
    >
      <Grid
        container
        className={classes.contents}
        alignItems="center"
        justify="space-between"
        item
        xs={11}
      >
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          className={classes.menuButton}
          onClick={() => {
            setMobileOpen(!mobileOpen);
          }}
        >
          <MenuIcon />
        </IconButton>

        <Grid item>
          <Link to="/">
            <img
              alt="로고이미지"
              src={logoImage}
              className={classes.logoImage}
            />
          </Link>
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
