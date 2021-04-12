import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './styles/index.css';
import { BrowserRouter } from 'react-router-dom';
// import { StoreProvider } from './stores/Context';
// import { RootStore } from './stores/RootStore';

// const rootStore = new RootStore();

ReactDOM.render(
  // <StoreProvider value={rootStore}>
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  // </StoreProvider>,
  document.getElementById('root'),
);
