import React from 'react';
import LoadingImg from '../../Image/loading.gif';
import './Loading.css';

const Loading = () => {
  return (
    <div className="LoadingWrap">
      <img src={LoadingImg} alt="loading" />
    </div>
  );
};
export default Loading;
