import './Committee.css';

import React from 'react';
import One from '../assets/1.png';
import Two from '../assets/2.png';
import Three from '../assets/3.png';
import Four from '../assets/4.png';
import Five from '../assets/5.png';
import Six from '../assets/6.png';
import Seven from '../assets/7.png';
import Eight from '../assets/8.png';
import Nine from '../assets/9.png';
import Ten from '../assets/10.png';
import Eleven from '../assets/11.png';
import Twelve from '../assets/12.png';

const CommitteeImages = () => {
  return (
    <div className="committee-gallery">
      <img src={One} alt="1" className="committee-image" />
      <img src={Two} alt="2" className="committee-image" />
      <img src={Three} alt="3" className="committee-image" />
      <img src={Four} alt="4" className="committee-image" />
      <img src={Five} alt="5" className="committee-image" />
      <img src={Six} alt="6" className="committee-image" />
      <img src={Seven} alt="7" className="committee-image" />
      <img src={Eight} alt="8" className="committee-image" />
      <img src={Nine} alt="9" className="committee-image" />
      <img src={Ten} alt="10" className="committee-image" />
      <img src={Eleven} alt="11" className="committee-image" />
      <img src={Twelve} alt="12" className="committee-image" />
    </div>
  );
};

const Committee = () => {
  return (
    <div className="committee">
      <h2 className="heading">Committee of 2024-25</h2>
      <CommitteeImages />
    </div>
  );
};

export default Committee;
