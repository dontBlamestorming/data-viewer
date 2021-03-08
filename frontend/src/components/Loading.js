import React from 'react';
import LoadingImg from '../assets/loading.gif';
import '../styles/Loading.css';

const Loading = () => {
  return (
    <div className="LoadingWrap">
      <img src={LoadingImg} alt="loading" />
    </div>
  );
};
export default Loading;
