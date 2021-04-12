import React from 'react';
import LoadingImg from '../assets/loading.gif';
import '../styles/Loading.css';

const Loading = () => {
  return (
    <div className="LoadingWrap">
      <img src={LoadingImg} width={100} height={100} alt="loading" />
    </div>
  );
};
export default Loading;
