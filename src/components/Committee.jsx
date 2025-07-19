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
    <div className="flex flex-col items-center mt-10">
      <img src={One} alt="1" className="w-4/5" />
      <img src={Two} alt="2" className="w-4/5" />
      <img src={Three} alt="3" className="w-4/5" />
      <img src={Four} alt="4" className="w-4/5" />
      <img src={Five} alt="5" className="w-4/5" />
      <img src={Six} alt="6" className="w-4/5" />
      <img src={Seven} alt="7" className="w-4/5" />
      <img src={Eight} alt="8" className="w-4/5" />
      <img src={Nine} alt="9" className="w-4/5" />
      <img src={Ten} alt="10" className="w-4/5" />
      <img src={Eleven} alt="11" className="w-4/5" />
      <img src={Twelve} alt="12" className="w-4/5" />
    </div>
  );
};

const Committee = () => {
  return (
    <div className="flex flex-col items-center">
      <h2 className="bg-red-600 text-white text-[2.2rem] px-5 py-2.5 rounded-lg w-fit mt-10">
        Committee of 2024-25
      </h2>
      <CommitteeImages />
    </div>
  );
};

export default Committee;
