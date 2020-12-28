import React from 'react';
import image1 from './images/01.svg';
import image2 from './images/02.svg';
import image3 from './images/03.svg';
import image5 from './images/05.svg';
import image6 from './images/06.svg';
import './no-data.css';

export function NoData() {
  const images = [image1, image2, image3, image5, image6];
  const index = Math.floor(Math.random() * images.length);
  const image = images[index];
  return (
    <div className="no-data">
      <img className="no-data__image" src={image} alt="No data!" />
      <div>No data!</div>
    </div>
  );
}
