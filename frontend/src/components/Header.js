import React from 'react';
import { Link } from 'react-router-dom';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { makeStyles } from '@material-ui/core';

import logoImage from '../assets/logo.png';

export default function Header({ authenticated }) {
  /**
   * Todo :
   * - 로그아웃 Btn 클릭하면 token delete and '/'로 던지기
   * - authenticated된 경우 버튼 텍스트 변경
   */

  const useStyles = makeStyles(() => ({
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
  }));

  const classes = useStyles();

  return (
    <Grid
      container
      className={classes.header}
      alignItems="flex-end"
      justify="center"
    >
      <Grid
        container
        className={classes.contents}
        xs={11}
        justify="space-between"
      >
        <Grid item>
          <Link to="/">
            <img
              alt="로고이미지"
              src={logoImage}
              className={classes.logoImage}
            />
          </Link>
        </Grid>

        <Grid>
          <Button
            onClick={() => {
              alert('파이팅!');
            }}
          >
            써머캣 만세
          </Button>

          <Button>{authenticated ? '로그아웃' : 'Data Viewer'}</Button>
        </Grid>
      </Grid>
    </Grid>
  );
}
