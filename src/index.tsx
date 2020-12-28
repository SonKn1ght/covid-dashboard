import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { App } from './App';
import { AppStore } from '@store';
import './index.css';

ReactDOM.render(
  <React.StrictMode>
    <Provider store={AppStore}>
      {/** @ts-ignore */}
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
