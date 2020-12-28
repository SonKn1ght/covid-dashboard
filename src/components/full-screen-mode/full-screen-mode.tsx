import * as React from 'react';
import './full-screen-mode.css';
import expand from './image/expand.svg';
import { TVoidSubscriberFullScreenMode } from "@types";

export const FullScreenMode = ( { click } : TVoidSubscriberFullScreenMode) => {

  return <div className='full-screen' onClick={ click }>
    <img src={ expand } width={ 25 } height={ 25 } alt=""/>
  </div>
}
