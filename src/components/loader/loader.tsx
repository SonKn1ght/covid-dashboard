import * as React from 'react';
import './loader.css';
import preloader from './preloader.gif';

export const Loader = () => {
  return (
    <div className="loader">
      <img className="loader__image" src={preloader} alt="Loading..." />
    </div>
  );
};
