import React from 'react';
import { makeStyles } from '@material-ui/core';
import LoadingImg from '../assets/loading.gif';

const Loading = () => {
  const classes = useStyles();

  return (
    <div className={classes.loadingWrap}>
      <img src={LoadingImg} width={100} height={100} alt="loading" />
    </div>
  );
};

const useStyles = makeStyles(() => ({
  loadingWrap: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100vw',
    height: '100vh',
  },
}));

export default Loading;
